import { describe, expect, it } from "vitest";
import { productLd } from "./seo";
import type { Product } from "@/domain/catalog";

const product = (over: Partial<Product> = {}): Product =>
  ({
    id: "p1", slug: "camiseta", name: "Camiseta", tagline: "", description: "Camiseta ACM", details: [], category: "ropa", collection: null,
    fulfillment: "pod", availability: "available", priceCents: 2995, unitCostCents: null, vatRate: 21,
    art: { kind: "tee", print: "logo" }, colors: [], sizes: null, featured: false, tags: [], affiliate: null, demo: false,
    variants: [{ id: "v1", sku: "ACM-V1", colorId: "navy", size: "M", priceCents: 2995, available: true, providerVariantId: "1" }],
    ...over,
  }) as unknown as Product;

describe("productLd", () => {
  it("incluye las fotos y la oferta cuando hay imágenes reales", () => {
    const ld = productLd(product({ images: { navy: ["https://files.cdn.printful.com/a.png", "https://files.cdn.printful.com/a.png"] } })) as Record<string, unknown>;
    expect(ld.image).toEqual(["https://files.cdn.printful.com/a.png"]);
    expect(ld.offers).toBeDefined();
  });
  it("sin foto no emite oferta (evita fichas de comerciante sin imagen)", () => {
    const ld = productLd(product({ images: null })) as Record<string, unknown>;
    expect(ld.image).toBeUndefined();
    expect(ld.offers).toBeUndefined();
  });
});
