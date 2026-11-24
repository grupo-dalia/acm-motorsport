import "server-only";
import { createHash } from "node:crypto";
import { purchaseEventId } from "./meta-pixel";

/**
 * API de conversiones de Meta (servidor). Envía el Purchase desde el webhook de Stripe con el mismo
 * event_id que el navegador, para que Meta lo cuente una sola vez aunque lleguen los dos.
 *
 * Solo se envía si:
 *  - hay NEXT_PUBLIC_META_PIXEL_ID y META_CAPI_TOKEN (solo servidor), y
 *  - el comprador había aceptado cookies de marketing al pagar (lo guardamos en la sesión de Stripe).
 * Email y teléfono van en SHA-256, normalizados como pide Meta.
 */
export const GRAPH_API_VERSION = "v26.0";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Solo dígitos y con prefijo de país. Un móvil o fijo español de 9 cifras se completa con 34. */
export function normalizePhone(phone: string, country = "ES"): string | null {
  let digits = phone.replace(/\D/g, "").replace(/^00/, "");
  if (!digits) return null;
  if (country === "ES" && digits.length === 9) digits = `34${digits}`;
  return digits.length >= 8 ? digits : null;
}

export type PurchaseInput = {
  orderReference: string;
  valueCents: number;
  currency?: "EUR";
  contents: { id: string; quantity: number; itemPriceCents: number }[];
  email?: string | null;
  phone?: string | null;
  country?: string | null;
  postalCode?: string | null;
  city?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  eventSourceUrl: string;
  eventTime?: number;
};

export function buildPurchasePayload(p: PurchaseInput) {
  const user_data: Record<string, string[] | string> = {};
  if (p.email) user_data.em = [sha256(normalizeEmail(p.email))];
  const ph = p.phone ? normalizePhone(p.phone, p.country ?? "ES") : null;
  if (ph) user_data.ph = [sha256(ph)];
  if (p.country) user_data.country = [sha256(p.country.trim().toLowerCase())];
  if (p.postalCode) user_data.zp = [sha256(p.postalCode.replace(/\s/g, "").toLowerCase())];
  if (p.city) user_data.ct = [sha256(p.city.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z]/gi, "").toLowerCase())];
  user_data.external_id = [sha256(p.orderReference)];
  if (p.fbp) user_data.fbp = p.fbp;
  if (p.fbc) user_data.fbc = p.fbc;
  if (p.clientIp) user_data.client_ip_address = p.clientIp;
  if (p.userAgent) user_data.client_user_agent = p.userAgent;
  return {
    data: [
      {
        event_name: "Purchase",
        event_time: p.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: purchaseEventId(p.orderReference),
        action_source: "website",
        event_source_url: p.eventSourceUrl,
        user_data,
        custom_data: {
          currency: p.currency ?? "EUR",
          value: Math.round(p.valueCents) / 100,
          content_type: "product",
          content_ids: [...new Set(p.contents.map((c) => c.id))],
          contents: p.contents.map((c) => ({ id: c.id, quantity: c.quantity, item_price: Math.round(c.itemPriceCents) / 100 })),
          num_items: p.contents.reduce((s, c) => s + c.quantity, 0),
          order_id: p.orderReference,
        },
      },
    ],
  };
}

/** Envía el Purchase. Nunca lanza: un fallo de Meta no puede romper el webhook de pagos. */
export async function sendPurchaseToMeta(p: PurchaseInput, env = { pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim(), token: process.env.META_CAPI_TOKEN?.trim(), testCode: process.env.META_CAPI_TEST_EVENT_CODE?.trim() }): Promise<{ sent: boolean; error?: string }> {
  if (!env.pixelId || !env.token) return { sent: false, error: "not_configured" };
  const body = { ...buildPurchasePayload(p), ...(env.testCode ? { test_event_code: env.testCode } : {}) };
  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${encodeURIComponent(env.pixelId)}/events?access_token=${encodeURIComponent(env.token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) {
      const text = (await res.text()).slice(0, 300);
      console.error("[meta-capi] Purchase", res.status, text);
      return { sent: false, error: `${res.status}` };
    }
    return { sent: true };
  } catch (e) {
    console.error("[meta-capi] Purchase", e instanceof Error ? e.message : e);
    return { sent: false, error: "network" };
  }
}
