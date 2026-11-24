import "server-only";
import { serverEnv, effectiveCommerceMode } from "@/lib/env";
import { priceCart, type Cart } from "@/domain/cart";
import { activeZoneFor, withoutVat } from "@/domain/shipping";
import { demoCatalog } from "./demo-catalog";
import { PrintfulFulfillment } from "./printful";
import { fetchPrintfulCatalog } from "./printful-catalog";
import { DemoPayments } from "../payments/demo";
import { StripePayments } from "../payments/stripe";
import type { CatalogProvider, Customer, DraftOrder, PaymentProvider } from "./types";
import type { Product } from "@/domain/catalog";
import { db } from "@/lib/supabase/service";

/**
 * Con PRINTFUL_API_KEY y al menos un producto creado en Printful, la tienda muestra el catálogo real.
 * Si Printful no responde o aún no hay productos, se queda el catálogo demo.
 */
let lastGood: Product[] | null = null;
/** Último resultado de Printful, para /api/status (sin secretos). */
export const printfulHealth: { ok: boolean | null; products: number; error: string | null } = { ok: null, products: 0, error: null };

async function liveProducts(): Promise<Product[]> {
  if (!serverEnv.PRINTFUL_API_KEY) return demoCatalog;
  try {
    const items = await fetchPrintfulCatalog(serverEnv.PRINTFUL_API_KEY, serverEnv.PRINTFUL_STORE_ID);
    Object.assign(printfulHealth, { ok: true, products: items.length, error: null });
    if (items.length) lastGood = items;
    return items.length ? items : demoCatalog;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    Object.assign(printfulHealth, { ok: false, error: msg.replace(/Bearer\s+\S+/g, "").slice(0, 160) });
    console.error("[printful] catálogo", msg);
    return lastGood ?? demoCatalog;
  }
}

export const catalog: CatalogProvider = {
  get id() {
    return serverEnv.PRINTFUL_API_KEY ? "printful" : "demo";
  },
  listProducts: liveProducts,
  async getProductBySlug(slug) {
    return (await liveProducts()).find((p) => p.slug === slug) ?? null;
  },
};

export const fulfillment = new PrintfulFulfillment(serverEnv.PRINTFUL_API_KEY, serverEnv.PRINTFUL_STORE_ID);

export function paymentsProvider(): PaymentProvider {
  return effectiveCommerceMode() === "demo" ? new DemoPayments() : new StripePayments();
}

/** Guarda el id de la sesión de pago en el pedido (para cruzarlo con el webhook). */
export async function attachPaymentSession(reference: string, sessionId: string) {
  const supa = db();
  if (!supa) return;
  const { error } = await supa.from("orders").update({ payment_session_id: sessionId, updated_at: new Date().toISOString() }).eq("reference", reference);
  if (error) console.error("[orders] sesión de pago", error.message);
}

type PaidInfo = { sessionId: string; paymentIntentId: string | null; amountCents: number | null };

/**
 * Marca el pedido como pagado SOLO si estaba pendiente (idempotente: Stripe puede repetir el webhook).
 * Devuelve el pedido con sus líneas para producirlo, o null si ya estaba procesado o no existe.
 */
export async function markOrderPaid(reference: string, info: PaidInfo): Promise<(DraftOrder & { dbId: string }) | null> {
  const supa = db();
  if (!supa) throw new Error("Base de datos no disponible");
  const { data, error } = await supa
    .from("orders")
    .update({ status: "paid", payment_session_id: info.sessionId, payment_intent_id: info.paymentIntentId, updated_at: new Date().toISOString() })
    .eq("reference", reference)
    .eq("status", "pending_payment")
    .select("id, reference, idempotency_key, created_at, status, mode, email, customer_name, customer_phone, shipping_address, subtotal_cents, discount_cents, shipping_cents, total_cents")
    .maybeSingle();
  if (error) throw new Error(`[orders] marcar pagado: ${error.message}`);
  if (!data) return null;
  if (info.amountCents != null && info.amountCents !== data.total_cents) {
    await supa.from("order_events").insert({ order_id: data.id, type: "incident", payload: { reason: "amount_mismatch", paid: info.amountCents, expected: data.total_cents }, actor: "webhook:stripe" });
  }
  await supa.from("order_events").insert({ order_id: data.id, type: "status_change", payload: { to: "paid", session: info.sessionId }, actor: "webhook:stripe" });
  const { data: items } = await supa.from("order_items").select("sku, name, qty, unit_cents, fulfillment").eq("order_id", data.id);
  const addr = data.shipping_address as Customer;
  return {
    dbId: data.id,
    id: data.reference,
    idempotencyKey: data.idempotency_key,
    createdAt: data.created_at,
    status: "paid",
    mode: data.mode,
    customer: { ...addr, email: data.email },
    totals: {
      lines: (items ?? []).map((i) => ({ productId: "", variantId: i.sku, qty: i.qty, name: i.name, slug: "", variantLabel: "", unitCents: i.unit_cents, totalCents: i.unit_cents * i.qty, fulfillment: i.fulfillment })),
      subtotalCents: data.subtotal_cents,
      discountCents: data.discount_cents,
      shippingCents: data.shipping_cents,
      totalCents: data.total_cents,
      coupon: null,
    },
  };
}

/** Cambia el estado de un pedido pendiente (pago fallido, sesión caducada…). */
export async function setOrderStatus(reference: string, status: "payment_failed" | "cancelled", payload: Record<string, unknown>) {
  const supa = db();
  if (!supa) return;
  const { data } = await supa.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("reference", reference).eq("status", "pending_payment").select("id").maybeSingle();
  if (data) await supa.from("order_events").insert({ order_id: data.id, type: "status_change", payload: { to: status, ...payload }, actor: "webhook:stripe" });
}

/** Tras el pago: borrador en Printful y, solo en modo live autorizado, confirmación para producir. */
export async function sendToProduction(order: DraftOrder & { dbId: string }) {
  const supa = db();
  if (!fulfillment.configured || !order.totals.lines.some((l) => l.fulfillment === "pod")) return;
  try {
    const { providerOrderId } = await fulfillment.createDraft(order);
    const live = order.mode === "live" && effectiveCommerceMode() === "live";
    if (live) await fulfillment.confirm(providerOrderId);
    await supa?.from("orders").update({ provider_order_id: providerOrderId, status: live ? "in_production" : "paid", updated_at: new Date().toISOString() }).eq("id", order.dbId);
    await supa?.from("order_events").insert({ order_id: order.dbId, type: "status_change", payload: { to: live ? "in_production" : "paid", printful: providerOrderId, confirmed: live }, actor: "system" });
  } catch (e) {
    const msg = e instanceof Error ? e.message.slice(0, 300) : String(e);
    console.error("[printful] pedido", order.id, msg);
    await supa?.from("orders").update({ status: "incident", updated_at: new Date().toISOString() }).eq("id", order.dbId);
    await supa?.from("order_events").insert({ order_id: order.dbId, type: "incident", payload: { reason: "printful", error: msg }, actor: "system" });
  }
}

/**
 * Idempotencia: en demo un Map en memoria. En Fase 3 → tabla `orders` con UNIQUE(idempotency_key).
 * Repetir la misma petición devuelve el mismo pedido en lugar de duplicarlo.
 */
const ordersByKey = new Map<string, DraftOrder>();

export async function createDraftOrder(cart: Cart, customer: Customer, idempotencyKey: string) {
  const existing = ordersByKey.get(idempotencyKey) ?? (await findStoredOrder(idempotencyKey));
  if (existing) return { order: existing, replayed: true as const };

  // Zona de envío (src/content/shipping.ts): solo se aceptan direcciones de zonas activas.
  const zone = activeZoneFor(customer.country, customer.postalCode);
  if (!zone) throw new CheckoutError("De momento no enviamos a esa dirección.");
  // Cobrar en USD necesita los precios en USD por producto: hasta tenerlos, una zona en USD no puede vender.
  if (zone.currency !== "EUR") throw new CheckoutError("Esta zona todavía no está disponible.");

  const totals = priceCart(cart, await catalog.listProducts(), zone);
  if (totals.lines.length === 0) throw new CheckoutError("El carrito no contiene productos válidos.");
  if (totals.invalid.length > 0) throw new CheckoutError("Algunos productos ya no están disponibles. Revisa el carrito.");

  const { invalid: _invalid, ...priced } = totals;
  void _invalid;
  let rest = zone.vat === "exempt" ? exVat(priced) : priced;
  if (zone.rate.type === "printful") {
    const pod = rest.lines.filter((l) => l.fulfillment === "pod");
    const quoted = pod.length ? await fulfillment.quoteShipping({ countryCode: customer.country, zip: customer.postalCode }, pod.map((l) => ({ syncVariantId: Number(l.variantId.replace(/^pf-/, "")), qty: l.qty }))) : 0;
    const shippingCents = quoted + zone.rate.marginCents;
    rest = { ...rest, shippingCents, totalCents: rest.subtotalCents - rest.discountCents + shippingCents };
  }
  const order: DraftOrder = {
    id: `ACM-${Date.now().toString(36).toUpperCase()}-${idempotencyKey.slice(0, 4).toUpperCase()}`,
    idempotencyKey,
    createdAt: new Date().toISOString(),
    status: "pending_payment",
    totals: rest,
    customer,
    mode: effectiveCommerceMode(),
  };
  ordersByKey.set(idempotencyKey, order);
  const replayedFromDb = await storeOrder(order);
  if (replayedFromDb) return { order: replayedFromDb, replayed: true as const };
  return { order, replayed: false as const };
}

/** Pedido ya guardado con esa clave de idempotencia (si hay base de datos). */
async function findStoredOrder(idempotencyKey: string): Promise<DraftOrder | null> {
  const supa = db();
  if (!supa) return null;
  const { data } = await supa.from("orders").select("reference, created_at, status, mode, email, customer_name, customer_phone, shipping_address, subtotal_cents, discount_cents, shipping_cents, total_cents").eq("idempotency_key", idempotencyKey).maybeSingle();
  if (!data) return null;
  const addr = data.shipping_address as Customer;
  return {
    id: data.reference,
    idempotencyKey,
    createdAt: data.created_at,
    status: data.status,
    mode: data.mode,
    customer: { ...addr, email: data.email },
    totals: { lines: [], subtotalCents: data.subtotal_cents, discountCents: data.discount_cents, shippingCents: data.shipping_cents, totalCents: data.total_cents, coupon: null },
  };
}

/**
 * Guarda el pedido y sus líneas. La restricción UNIQUE(idempotency_key) evita duplicados
 * aunque lleguen dos peticiones a la vez: si choca, devolvemos el pedido que ya existía.
 */
async function storeOrder(order: DraftOrder): Promise<DraftOrder | null> {
  const supa = db();
  if (!supa) return null;
  const { customer: c, totals: t } = order;
  const { data, error } = await supa
    .from("orders")
    .insert({
      reference: order.id,
      idempotency_key: order.idempotencyKey,
      status: order.status,
      mode: order.mode,
      email: c.email.toLowerCase(),
      customer_name: c.name,
      customer_phone: c.phone ?? null,
      shipping_address: c,
      subtotal_cents: t.subtotalCents,
      discount_cents: t.discountCents,
      shipping_cents: t.shippingCents,
      total_cents: t.totalCents,
      payment_provider: order.mode === "demo" ? "demo" : "stripe",
    })
    .select("id")
    .single();
  if (error) {
    if (error.code === "23505") return findStoredOrder(order.idempotencyKey);
    console.error("[orders] no se ha podido guardar", error.message);
    return null; // el pedido sigue adelante; queda en el registro del servidor
  }
  const items = t.lines.map((l) => ({ order_id: data.id, sku: l.variantId, name: [l.name, l.variantLabel].filter(Boolean).join(" · "), qty: l.qty, unit_cents: l.unitCents, fulfillment: l.fulfillment }));
  if (items.length) {
    const { error: e2 } = await supa.from("order_items").insert(items);
    if (e2) console.error("[orders] líneas", e2.message);
  }
  await supa.from("order_events").insert({ order_id: data.id, type: "status_change", payload: { to: order.status, coupon: t.coupon?.code ?? null }, actor: "system" });
  return null;
}

export class CheckoutError extends Error {}

/** Zonas sin IVA español (Canarias, Ceuta, Melilla, exportación): se cobra la base imponible. */
function exVat<T extends { lines: { unitCents: number; totalCents: number; qty: number }[]; subtotalCents: number; discountCents: number; shippingCents: number; totalCents: number }>(t: T): T {
  const lines = t.lines.map((l) => {
    const unitCents = withoutVat(l.unitCents);
    return { ...l, unitCents, totalCents: unitCents * l.qty };
  });
  const subtotalCents = lines.reduce((s, l) => s + l.totalCents, 0);
  const discountCents = t.subtotalCents ? Math.round((t.discountCents * subtotalCents) / t.subtotalCents) : 0;
  const shippingCents = withoutVat(t.shippingCents);
  return { ...t, lines, subtotalCents, discountCents, shippingCents, totalCents: subtotalCents - discountCents + shippingCents };
}

/** Estado de integraciones sin exponer secretos (para /api/status y el futuro dashboard). */
export function integrationStatus() {
  return {
    commerceMode: effectiveCommerceMode(),
    catalog: catalog.id,
    payments: Boolean(serverEnv.STRIPE_SECRET_KEY) ? "configured" : "not_configured",
    // Solo el tipo de clave (nunca la clave): confirma que los cobros son reales.
    stripeKey: serverEnv.STRIPE_SECRET_KEY?.startsWith("sk_live_") || serverEnv.STRIPE_SECRET_KEY?.startsWith("rk_live_") ? "live" : serverEnv.STRIPE_SECRET_KEY ? "test" : "none",
    metaPixel: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()),
    metaCapi: Boolean(process.env.META_CAPI_TOKEN?.trim()),
    fulfillment: fulfillment.configured ? "configured" : "not_configured",
    database: Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY) ? "configured" : "not_configured",
    email: Boolean(serverEnv.EMAIL_PROVIDER_API_KEY) ? "configured" : "not_configured",
  } as const;
}
