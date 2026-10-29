import type { DraftOrder, PaymentProvider } from "../commerce/types";

/**
 * Pasarela simulada. No contacta con ningún servicio ni cobra nada.
 * Fase 4: StripePayments (Checkout Session + webhook `checkout.session.completed`
 * verificado con STRIPE_WEBHOOK_SECRET) implementará esta misma interfaz.
 */
export class DemoPayments implements PaymentProvider {
  readonly id = "demo";
  async createCheckout(order: DraftOrder, opts: { successUrl: string; cancelUrl: string }) {
    const url = new URL(opts.successUrl);
    url.searchParams.set("pedido", order.id);
    url.searchParams.set("demo", "1");
    return { redirectUrl: url.pathname + url.search };
  }
}
