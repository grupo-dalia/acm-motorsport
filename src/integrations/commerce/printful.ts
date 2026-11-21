import "server-only";
import type { DraftOrder, FulfillmentProvider } from "./types";

/**
 * Adaptador Printful — ESQUELETO (Fase 4).
 * No probado contra la API real: necesita PRINTFUL_API_KEY y revisión de la documentación vigente
 * (https://developers.printful.com/docs/) antes de activarse.
 *
 * Garantías de diseño:
 *  - `createDraft` crea pedidos como borrador (sin confirmar), nunca en producción.
 *  - `confirm` solo se llama desde el webhook de pago verificado y en modo live autorizado.
 */
export class PrintfulFulfillment implements FulfillmentProvider {
  readonly id = "printful";
  constructor(private readonly apiKey: string | undefined, private readonly storeId: string | undefined) {}

  get configured() {
    return Boolean(this.apiKey);
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    if (!this.apiKey) throw new Error("Printful no configurado (falta PRINTFUL_API_KEY)");
    const res = await fetch(`https://api.printful.com${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...(this.storeId ? { "X-PF-Store-Id": this.storeId } : {}),
        ...init.headers,
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Printful ${res.status}: ${await res.text()}`);
    return (await res.json()) as T;
  }

  async createDraft(order: DraftOrder) {
    const body = {
      external_id: order.id,
      recipient: {
        name: order.customer.name,
        address1: order.customer.address1,
        address2: order.customer.address2,
        city: order.customer.city,
        zip: order.customer.postalCode,
        state_name: order.customer.province,
        country_code: order.customer.country,
        email: order.customer.email,
        phone: order.customer.phone,
      },
      items: order.totals.lines
        .filter((l) => l.fulfillment === "pod")
        // Nuestro id de variante es "pf-<id de la variante sincronizada en Printful>".
        .map((l) => ({ sync_variant_id: Number(l.variantId.replace(/^pf-/, "")), quantity: l.qty, retail_price: (l.unitCents / 100).toFixed(2) })),
    };
    const data = await this.request<{ result: { id: number } }>("/orders?confirm=false", { method: "POST", body: JSON.stringify(body) });
    return { providerOrderId: String(data.result.id) };
  }

  async confirm(providerOrderId: string) {
    await this.request(`/orders/${encodeURIComponent(providerOrderId)}/confirm`, { method: "POST" });
  }
}
