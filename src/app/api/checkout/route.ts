import { NextResponse, after } from "next/server";
import { TEAM_INBOX, html, layout, sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { checkoutRequestSchema } from "@/domain/checkout";
import { CheckoutError, createDraftOrder, paymentsProvider } from "@/integrations/commerce";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { absoluteUrl } from "@/lib/site";

/**
 * POST /api/checkout
 * 1. Valida entrada con Zod.  2. Recalcula precios en servidor.  3. Crea pedido idempotente.
 * 4. Pide a la pasarela la URL de pago (demo: página de éxito simulada).
 * Nunca envía nada a producción: eso ocurre solo tras webhook de pago verificado (Fase 4).
 */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "checkout"), 8).ok) {
    return NextResponse.json({ ok: false, message: "Demasiados intentos. Espera un minuto." }, { status: 429 });
  }
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Petición no válida." }, { status: 400 });
  }
  const parsed = checkoutRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Revisa los datos del formulario.", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, { status: 422 });
  }
  const { cart, customer, idempotencyKey } = parsed.data;
  try {
    const { order, replayed } = await createDraftOrder(cart, { ...customer, address2: customer.address2 || undefined, phone: customer.phone || undefined }, idempotencyKey);
    const { redirectUrl } = await paymentsProvider().createCheckout(order, {
      successUrl: absoluteUrl("/checkout/exito"),
      cancelUrl: absoluteUrl("/carrito"),
    });
    if (!replayed) {
      // Aviso al equipo. En modo demo NO se escribe al cliente (cualquiera podría poner un email ajeno);
      // la confirmación al cliente se enviará tras el pago verificado (Fase 4).
      after(() =>
        sendEmail({
          to: TEAM_INBOX,
          subject: `${order.mode === "demo" ? "[Prueba] " : ""}Pedido ${order.id} · ${formatPrice(order.totals.totalCents)}`,
          html: layout({
            title: `${order.mode === "demo" ? "Pedido de prueba" : "Nuevo pedido"} ${order.id}`,
            intro: `${order.customer.name} · ${order.customer.email} · ${order.customer.city}`,
            body: `<ul style="margin:0;padding-left:18px">${order.totals.lines.map((l) => `<li>${l.qty}× ${html.esc(l.name)}${l.variantLabel ? ` · ${html.esc(l.variantLabel)}` : ""}</li>`).join("")}</ul><p style="margin:12px 0 0"><strong>Total: ${formatPrice(order.totals.totalCents)}</strong></p>`,
            cta: { href: absoluteUrl("/admin"), label: "Ver en el panel" },
          }),
          text: `Pedido ${order.id} · ${order.customer.name} · ${formatPrice(order.totals.totalCents)}`,
        }),
      );
    }
    return NextResponse.json({ ok: true, orderId: order.id, mode: order.mode, replayed, redirectUrl, totalCents: order.totals.totalCents });
  } catch (e) {
    if (e instanceof CheckoutError) return NextResponse.json({ ok: false, message: e.message }, { status: 409 });
    console.error("[checkout]", e);
    return NextResponse.json({ ok: false, message: "No se ha podido iniciar el pago." }, { status: 500 });
  }
}
