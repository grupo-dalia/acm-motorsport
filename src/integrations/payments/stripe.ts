import "server-only";
import Stripe from "stripe";
import type { DraftOrder, PaymentProvider } from "../commerce/types";
import { activeZoneFor } from "@/domain/shipping";

/**
 * Pago con Stripe Checkout (página alojada por Stripe).
 * - Métodos de pago dinámicos: no se pasa payment_method_types; Stripe muestra los que mejor convierten
 *   (tarjeta, Apple Pay, Google Pay, Link, Bizum si está activo…), configurables en el Dashboard.
 * - Precios con IVA incluido: cada línea lleva un tipo de IVA 21 % "inclusive", así la factura lo desglosa.
 * - Factura automática tras el pago (invoice_creation), para quien necesite factura.
 * - El precio lo calcula SIEMPRE nuestro servidor; Stripe solo cobra ese importe.
 * - El pedido se marca pagado únicamente desde el webhook firmado (ver /api/webhooks/stripe).
 */
let client: Stripe | null = null;
export function stripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe no configurado (falta STRIPE_SECRET_KEY)");
  client ??= new Stripe(key, { appInfo: { name: "acmmotorsport.com" } });
  return client;
}

/** Tipo de IVA 21 % incluido en precio. Se busca una vez y, si no existe, se crea. */
let vatRateId: string | null = null;
async function vatRate(s: Stripe): Promise<string> {
  if (vatRateId) return vatRateId;
  const list = await s.taxRates.list({ active: true, inclusive: true, limit: 100 });
  const found = list.data.find((r) => r.percentage === 21 && r.country === "ES" && r.metadata?.acm === "iva21");
  vatRateId = (found ?? (await s.taxRates.create({ display_name: "IVA", percentage: 21, inclusive: true, country: "ES", jurisdiction: "ES", description: "IVA general España", metadata: { acm: "iva21" } }))).id;
  return vatRateId;
}

export class StripePayments implements PaymentProvider {
  readonly id = "stripe";

  async createCheckout(order: DraftOrder, opts: { successUrl: string; cancelUrl: string; tracking?: Record<string, string> }) {
    const s = stripe();
    // Solo las zonas con IVA español incluido llevan el 21 %; en las exentas el pedido ya viene en base imponible.
    const vatIncluded = (activeZoneFor(order.customer.country, order.customer.postalCode)?.vat ?? "included") === "included";
    const tax = vatIncluded ? await vatRate(s) : null;
    const t = order.totals;

    // Descuento calculado en nuestro servidor → cupón de un solo uso por el importe exacto.
    let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
    if (t.discountCents > 0) {
      const coupon = await s.coupons.create(
        { amount_off: t.discountCents, currency: "eur", duration: "once", max_redemptions: 1, name: t.coupon?.label?.slice(0, 40) ?? "Descuento", metadata: { order: order.id } },
        { idempotencyKey: `coupon-${order.idempotencyKey}` },
      );
      discounts = [{ coupon: coupon.id }];
    }

    const success = new URL(opts.successUrl);
    success.searchParams.set("pedido", order.id);
    const successUrl = `${success.toString()}&session_id={CHECKOUT_SESSION_ID}`;

    const session = await s.checkout.sessions.create(
      {
        mode: "payment",
        locale: "es",
        currency: "eur",
        customer_email: order.customer.email,
        client_reference_id: order.id,
        // tracking: consentimiento de marketing y cookies de Meta (_fbp/_fbc) para la API de conversiones.
        metadata: { order: order.id, mode: order.mode, ...opts.tracking },
        payment_intent_data: { metadata: { order: order.id }, description: `Pedido ${order.id}` },
        line_items: t.lines.map((l) => ({
          quantity: l.qty,
          ...(tax ? { tax_rates: [tax] } : {}),
          price_data: {
            currency: "eur",
            unit_amount: l.unitCents,
            tax_behavior: "inclusive",
            product_data: { name: [l.name, l.variantLabel].filter(Boolean).join(" · ").slice(0, 250), metadata: { variant: l.variantId } },
          },
        })),
        discounts,
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              display_name: t.shippingCents === 0 ? "Envío gratis" : "Envío estándar",
              fixed_amount: { amount: t.shippingCents, currency: "eur" },
              tax_behavior: "inclusive",
              delivery_estimate: { minimum: { unit: "business_day", value: 5 }, maximum: { unit: "business_day", value: 11 } },
            },
          },
        ],
        invoice_creation: {
          enabled: true,
          invoice_data: { description: `Pedido ${order.id} · ACM Motorsport`, metadata: { order: order.id }, footer: "ACM Motorsport · acmmotorsport.com" },
        },
        success_url: successUrl,
        cancel_url: opts.cancelUrl,
        expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 h
      },
      { idempotencyKey: `checkout-${order.idempotencyKey}` },
    );
    if (!session.url) throw new Error("Stripe no ha devuelto la URL de pago");
    return { redirectUrl: session.url, sessionId: session.id };
  }
}
