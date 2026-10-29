import type { Product } from "@/domain/catalog";
import type { CartTotals } from "@/domain/cart";

/** Contratos que cualquier proveedor debe cumplir. La UI solo conoce estas interfaces. */

export interface CatalogProvider {
  readonly id: string;
  listProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
}

export type Customer = {
  email: string;
  name: string;
  address1: string;
  address2?: string;
  city: string;
  postalCode: string;
  province: string;
  country: "ES";
  phone?: string;
};

export type DraftOrder = {
  id: string;
  idempotencyKey: string;
  createdAt: string;
  status: OrderStatus;
  totals: Omit<CartTotals, "invalid">;
  customer: Customer;
  mode: "demo" | "sandbox" | "live";
};

/**
 * Ciclo de vida del pedido. Solo `paid` habilita la orden de producción.
 * pending_payment → paid → in_production → shipped → delivered
 *                 ↘ payment_failed      ↘ incident → refunded
 */
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "payment_failed"
  | "in_production"
  | "shipped"
  | "delivered"
  | "incident"
  | "refunded"
  | "cancelled";

export interface PaymentProvider {
  readonly id: string;
  createCheckout(order: DraftOrder, opts: { successUrl: string; cancelUrl: string }): Promise<{ redirectUrl: string }>;
}

export interface FulfillmentProvider {
  readonly id: string;
  readonly configured: boolean;
  /** Crea el pedido en el proveedor SIN confirmarlo para producción. */
  createDraft(order: DraftOrder): Promise<{ providerOrderId: string }>;
  /** Solo se invoca tras pago verificado por webhook y con modo live autorizado. */
  confirm(providerOrderId: string): Promise<void>;
}
