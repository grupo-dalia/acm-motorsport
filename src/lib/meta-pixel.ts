/**
 * Meta Pixel (navegador). Solo funciona si:
 *  1. Hay NEXT_PUBLIC_META_PIXEL_ID.
 *  2. El usuario ha aceptado las cookies de marketing (acm.consent.v1 → marketing: true).
 * Sin una de las dos, cada llamada es un no-op: no se carga nada de facebook.net ni se envía nada.
 *
 * Los eventos que se disparan antes de que el píxel arranque (p. ej. ViewContent al montar la ficha)
 * se guardan en cola y salen en cuanto se inicializa.
 */

export const CONSENT_KEY = "acm.consent.v1";
/** Se lanza en window al guardar las preferencias de cookies, para reaccionar sin recargar. */
export const CONSENT_EVENT = "acm:consent-changed";

export type PixelEventName = "PageView" | "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase";

export type CommerceData = {
  /** SKU de cada variante (los mismos ids que el feed de catálogo). */
  contentIds: string[];
  valueCents: number;
  numItems?: number;
  contents?: { id: string; quantity: number; itemPriceCents: number }[];
};

export type CommerceParams = {
  content_ids: string[];
  content_type: "product";
  value: number;
  currency: "EUR";
  num_items?: number;
  contents?: { id: string; quantity: number; item_price: number }[];
};

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; callMethod?: (...a: unknown[]) => void; push?: unknown };
type PixelWindow = { fbq?: Fbq; _fbq?: Fbq };

export function pixelId(): string | undefined {
  return process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim() || undefined;
}

export function readMarketingConsent(storage: Pick<Storage, "getItem"> | null = typeof window !== "undefined" ? safeStorage() : null): boolean {
  if (!storage) return false;
  try {
    const raw = storage.getItem(CONSENT_KEY);
    return raw ? Boolean((JSON.parse(raw) as { marketing?: unknown }).marketing === true) : false;
  } catch {
    return false;
  }
}

function safeStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const euros = (cents: number) => Math.round(cents) / 100;

/** Parámetros estándar de e-commerce que pide Meta. */
export function buildCommerceParams(d: CommerceData): CommerceParams {
  return {
    content_ids: [...new Set(d.contentIds)].slice(0, 50),
    content_type: "product",
    value: euros(d.valueCents),
    currency: "EUR",
    ...(d.numItems != null ? { num_items: d.numItems } : {}),
    ...(d.contents ? { contents: d.contents.map((c) => ({ id: c.id, quantity: c.quantity, item_price: euros(c.itemPriceCents) })) } : {}),
  };
}

/** Mismo id en el navegador y en la API de conversiones: así Meta cuenta la compra una sola vez. */
export function purchaseEventId(orderReference: string): string {
  return `purchase.${orderReference}`;
}

type Pending = { name: PixelEventName; params?: CommerceParams; eventId?: string };
const pending: Pending[] = [];

export type PixelDeps = { id?: string; consent: boolean; win?: PixelWindow | null };

function defaultDeps(): PixelDeps {
  return { id: pixelId(), consent: readMarketingConsent(), win: typeof window !== "undefined" ? (window as unknown as PixelWindow) : null };
}

/**
 * Envía un evento al píxel. Devuelve true si se ha enviado o encolado; false si no procede
 * (sin ID, sin consentimiento o fuera del navegador).
 */
export function trackPixel(name: PixelEventName, data?: CommerceData, opts: { eventId?: string } = {}, deps: PixelDeps = defaultDeps()): boolean {
  if (!deps.id || !deps.consent || !deps.win) return false;
  const params = data ? buildCommerceParams(data) : undefined;
  const fbq = deps.win.fbq;
  if (!fbq || !initialized) {
    pending.push({ name, params, eventId: opts.eventId });
    return true;
  }
  send(fbq, { name, params, eventId: opts.eventId });
  return true;
}

function send(fbq: Fbq, e: Pending) {
  const args: unknown[] = ["track", e.name];
  if (e.params || e.eventId) args.push(e.params ?? {});
  if (e.eventId) args.push({ eventID: e.eventId });
  fbq(...args);
}

let initialized = false;

/**
 * Crea la función fbq (el "stub" oficial: encola hasta que carga fbevents.js), inicializa el píxel
 * y vacía la cola. Lo llama el componente MetaPixel solo con consentimiento.
 */
export function initPixel(id: string, win: PixelWindow = window as unknown as PixelWindow): void {
  if (!win.fbq) {
    const n: Fbq = function (...args: unknown[]) {
      if (n.callMethod) n.callMethod(...args);
      else n.queue!.push(args);
    } as Fbq;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    win.fbq = n;
    win._fbq ??= n;
  }
  if (!initialized) {
    win.fbq!("consent", "grant");
    win.fbq!("init", id);
    initialized = true;
  }
  while (pending.length) send(win.fbq!, pending.shift()!);
}

/** Al retirar el consentimiento: el píxel deja de enviar (Meta respeta "revoke") y se vacía la cola. */
export function revokePixel(win: PixelWindow | null = typeof window !== "undefined" ? (window as unknown as PixelWindow) : null): void {
  pending.length = 0;
  win?.fbq?.("consent", "revoke");
}

/** Solo para tests. */
export function __resetPixelForTests() {
  pending.length = 0;
  initialized = false;
}
export function __pendingForTests() {
  return [...pending];
}

/** Purchase del navegador, una sola vez por pedido aunque recarguen la página de éxito. */
export function trackPurchaseOnce(orderReference: string, data: CommerceData, storage: Pick<Storage, "getItem" | "setItem"> | null = typeof window !== "undefined" ? safeStorage() : null, deps?: PixelDeps): boolean {
  const key = `acm.px.purchase.${orderReference}`;
  try {
    if (storage?.getItem(key)) return false;
  } catch {}
  const sent = trackPixel("Purchase", data, { eventId: purchaseEventId(orderReference) }, deps);
  if (sent) {
    try {
      storage?.setItem(key, "1");
    } catch {}
  }
  return sent;
}
