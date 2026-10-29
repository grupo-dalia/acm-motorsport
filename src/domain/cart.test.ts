import { describe, expect, it } from "vitest";
import { cartReducer, emptyCart, priceCart, MAX_QTY, SHIPPING_RULES } from "./cart";
import { demoCatalog } from "@/integrations/commerce/demo-catalog";

const tee = demoCatalog.find((p) => p.id === "tee-acm-core")!;
const teeM = tee.variants.find((v) => v.size === "M")!;
const stickers = demoCatalog.find((p) => p.id === "stickers-pack")!;

describe("cartReducer", () => {
  it("suma cantidades de la misma variante y respeta el máximo", () => {
    let c = cartReducer(emptyCart, { type: "add", line: { productId: tee.id, variantId: teeM.id, qty: 4 } });
    c = cartReducer(c, { type: "add", line: { productId: tee.id, variantId: teeM.id, qty: 9 } });
    expect(c.lines).toHaveLength(1);
    expect(c.lines[0]!.qty).toBe(MAX_QTY);
  });
  it("elimina la línea al poner cantidad 0", () => {
    const c = cartReducer({ ...emptyCart, lines: [{ productId: tee.id, variantId: teeM.id, qty: 1 }] }, { type: "setQty", variantId: teeM.id, qty: 0 });
    expect(c.lines).toHaveLength(0);
  });
});

describe("priceCart (precio autoritativo)", () => {
  it("usa el precio del catálogo, no el del cliente", () => {
    const t = priceCart({ coupon: null, lines: [{ productId: tee.id, variantId: teeM.id, qty: 2 }] }, demoCatalog);
    expect(t.subtotalCents).toBe(tee.priceCents * 2);
  });
  it("aplica envío por debajo del umbral y gratis por encima", () => {
    const small = priceCart({ coupon: null, lines: [{ productId: stickers.id, variantId: stickers.variants[0]!.id, qty: 1 }] }, demoCatalog);
    expect(small.shippingCents).toBe(SHIPPING_RULES.flatCents);
    const big = priceCart({ coupon: null, lines: [{ productId: tee.id, variantId: teeM.id, qty: 3 }] }, demoCatalog);
    expect(big.shippingCents).toBe(0);
  });
  it("separa variantes inexistentes, agotadas o de afiliación", () => {
    const aff = demoCatalog.find((p) => p.fulfillment === "affiliate")!;
    const t = priceCart(
      {
        coupon: null,
        lines: [
          { productId: tee.id, variantId: "no-existe", qty: 1 },
          { productId: tee.id, variantId: "tee-acm-core-blanco-xxl", qty: 1 },
          { productId: aff.id, variantId: aff.variants[0]!.id, qty: 1 },
        ],
      },
      demoCatalog,
    );
    expect(t.lines).toHaveLength(0);
    expect(t.invalid).toHaveLength(3);
  });
  it("aplica el cupón demo e ignora cupones desconocidos", () => {
    const lines = [{ productId: tee.id, variantId: teeM.id, qty: 1 }];
    expect(priceCart({ coupon: "demo10", lines }, demoCatalog).discountCents).toBe(Math.round(tee.priceCents * 0.1));
    expect(priceCart({ coupon: "GRATIS", lines }, demoCatalog).discountCents).toBe(0);
  });
});
