import "server-only";
import { serverEnv, effectiveCommerceMode } from "@/lib/env";
import { priceCart, type Cart } from "@/domain/cart";
import { demoCatalog } from "./demo-catalog";
import { PrintfulFulfillment } from "./printful";
import { fetchPrintfulCatalog } from "./printful-catalog";
import { DemoPayments } from "../payments/demo";
import type { CatalogProvider, Customer, DraftOrder } from "./types";
import type { Product } from "@/domain/catalog";
import { db } from "@/lib/supabase/service";

/**
 * Con PRINTFUL_API_KEY y al menos un producto creado en Printful, la tienda muestra el catálogo real.
 * Si Printful no responde o aún no hay productos, se queda el catálogo demo.
 */
let lastGood: Product[] | null = null;
async function liveProducts(): Promise<Product[]> {
  if (!serverEnv.PRINTFUL_API_KEY) return demoCatalog;
  try {
    const items = await fetchPrintfulCatalog(serverEnv.PRINTFUL_API_KEY, serverEnv.PRINTFUL_STORE_ID);
    if (items.length) lastGood = items;
    return items.length ? items : demoCatalog;
  } catch (e) {
    console.error("[printful] catálogo", e instanceof Error ? e.message : e);
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

export function paymentsProvider() {
  // Fase 4: devolver StripePayments cuando effectiveCommerceMode() !== "demo".
  return new DemoPayments();
}

/**
 * Idempotencia: en demo un Map en memoria. En Fase 3 → tabla `orders` con UNIQUE(idempotency_key).
 * Repetir la misma petición devuelve el mismo pedido en lugar de duplicarlo.
 */
const ordersByKey = new Map<string, DraftOrder>();

export async function createDraftOrder(cart: Cart, customer: Customer, idempotencyKey: string) {
  const existing = ordersByKey.get(idempotencyKey) ?? (await findStoredOrder(idempotencyKey));
  if (existing) return { order: existing, replayed: true as const };

  const totals = priceCart(cart, await catalog.listProducts());
  if (totals.lines.length === 0) throw new CheckoutError("El carrito no contiene productos válidos.");
  if (totals.invalid.length > 0) throw new CheckoutError("Algunos productos ya no están disponibles. Revisa el carrito.");

  const { invalid: _invalid, ...rest } = totals;
  void _invalid;
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

/** Estado de integraciones sin exponer secretos (para /api/status y el futuro dashboard). */
export function integrationStatus() {
  return {
    commerceMode: effectiveCommerceMode(),
    catalog: catalog.id,
    payments: Boolean(serverEnv.STRIPE_SECRET_KEY) ? "configured" : "not_configured",
    fulfillment: fulfillment.configured ? "configured" : "not_configured",
    database: Boolean(serverEnv.SUPABASE_SERVICE_ROLE_KEY) ? "configured" : "not_configured",
    email: Boolean(serverEnv.EMAIL_PROVIDER_API_KEY) ? "configured" : "not_configured",
  } as const;
}
