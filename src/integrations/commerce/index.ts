import "server-only";
import { serverEnv, effectiveCommerceMode } from "@/lib/env";
import { priceCart, type Cart } from "@/domain/cart";
import { demoCatalog } from "./demo-catalog";
import { PrintfulFulfillment } from "./printful";
import { DemoPayments } from "../payments/demo";
import type { CatalogProvider, Customer, DraftOrder } from "./types";

/** Catálogo activo. Fase 1–2: demo. Fase 4: Supabase (sincronizado desde Printful). */
const demoCatalogProvider: CatalogProvider = {
  id: "demo",
  async listProducts() {
    return demoCatalog;
  },
  async getProductBySlug(slug) {
    return demoCatalog.find((p) => p.slug === slug) ?? null;
  },
};

export const catalog: CatalogProvider = demoCatalogProvider;
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
  const existing = ordersByKey.get(idempotencyKey);
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
  return { order, replayed: false as const };
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
