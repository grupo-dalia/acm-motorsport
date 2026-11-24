import { beforeEach, describe, expect, it, vi } from "vitest";
import { __pendingForTests, __resetPixelForTests, buildCommerceParams, initPixel, purchaseEventId, readMarketingConsent, trackPixel, trackPurchaseOnce } from "./meta-pixel";

const memStorage = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe("meta pixel", () => {
  beforeEach(() => __resetPixelForTests());

  it("construye el payload de e-commerce que pide Meta", () => {
    expect(buildCommerceParams({ contentIds: ["SKU-1", "SKU-1", "SKU-2"], valueCents: 2995, numItems: 2, contents: [{ id: "SKU-1", quantity: 2, itemPriceCents: 1495 }] })).toEqual({
      content_ids: ["SKU-1", "SKU-2"],
      content_type: "product",
      value: 29.95,
      currency: "EUR",
      num_items: 2,
      contents: [{ id: "SKU-1", quantity: 2, item_price: 14.95 }],
    });
  });

  it("no hace nada sin ID de píxel", () => {
    const fbq = vi.fn();
    expect(trackPixel("PageView", undefined, {}, { id: undefined, consent: true, win: { fbq } })).toBe(false);
    expect(fbq).not.toHaveBeenCalled();
    expect(__pendingForTests()).toHaveLength(0);
  });

  it("no hace nada sin consentimiento de marketing", () => {
    const fbq = vi.fn();
    expect(trackPixel("AddToCart", { contentIds: ["A"], valueCents: 100 }, {}, { id: "123", consent: false, win: { fbq } })).toBe(false);
    expect(fbq).not.toHaveBeenCalled();
    expect(__pendingForTests()).toHaveLength(0);
  });

  it("lee el consentimiento de marketing del banner", () => {
    expect(readMarketingConsent(memStorage())).toBe(false);
    expect(readMarketingConsent(memStorage({ "acm.consent.v1": JSON.stringify({ analytics: true, marketing: false }) }))).toBe(false);
    expect(readMarketingConsent(memStorage({ "acm.consent.v1": JSON.stringify({ analytics: false, marketing: true }) }))).toBe(true);
    expect(readMarketingConsent(memStorage({ "acm.consent.v1": "basura" }))).toBe(false);
  });

  it("encola hasta que arranca el píxel y luego envía con el eventID", () => {
    const win: { fbq?: (...a: unknown[]) => void } = {};
    trackPixel("ViewContent", { contentIds: ["A"], valueCents: 2500 }, {}, { id: "123", consent: true, win });
    expect(__pendingForTests()).toHaveLength(1);
    initPixel("123", win as never);
    expect(__pendingForTests()).toHaveLength(0);
    const queue = (win.fbq as unknown as { queue: unknown[][] }).queue;
    expect(queue[0]).toEqual(["consent", "grant"]);
    expect(queue[1]).toEqual(["init", "123"]);
    expect(queue[2]).toEqual(["track", "ViewContent", expect.objectContaining({ content_ids: ["A"], value: 25, currency: "EUR", content_type: "product" })]);
  });

  it("Purchase solo una vez por pedido y con el mismo event_id que el servidor", () => {
    const fbq = vi.fn();
    const win = { fbq };
    initPixel("123", win as never);
    const storage = memStorage();
    const deps = { id: "123", consent: true, win };
    const data = { contentIds: ["A"], valueCents: 4990 };
    expect(trackPurchaseOnce("ACM-1", data, storage, deps)).toBe(true);
    expect(trackPurchaseOnce("ACM-1", data, storage, deps)).toBe(false);
    const purchases = fbq.mock.calls.filter((c) => c[1] === "Purchase");
    expect(purchases).toHaveLength(1);
    expect(purchases[0]![3]).toEqual({ eventID: purchaseEventId("ACM-1") });
  });
});
