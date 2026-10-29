import { describe, expect, it } from "vitest";
import { queryProducts, relatedProducts, findVariant } from "./catalog";
import { demoCatalog } from "@/integrations/commerce/demo-catalog";

describe("catálogo", () => {
  it("filtra por categoría y tipo", () => {
    expect(queryProducts(demoCatalog, { categoria: "sudaderas" }).every((p) => p.category === "sudaderas")).toBe(true);
    expect(queryProducts(demoCatalog, { tipo: "acm" }).every((p) => p.fulfillment === "acm")).toBe(true);
  });
  it("busca por texto en nombre y etiquetas, sin distinguir mayúsculas", () => {
    const r = queryProducts(demoCatalog, { q: "DAKAR" });
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => [p.name, p.tagline, p.description, ...p.tags].join(" ").toLowerCase().includes("dakar"))).toBe(true);
  });
  it("ordena por precio", () => {
    const r = queryProducts(demoCatalog, { orden: "precio-asc" });
    for (let i = 1; i < r.length; i++) expect(r[i]!.priceCents).toBeGreaterThanOrEqual(r[i - 1]!.priceCents);
  });
  it("slugs y SKUs únicos", () => {
    expect(new Set(demoCatalog.map((p) => p.slug)).size).toBe(demoCatalog.length);
    const skus = demoCatalog.flatMap((p) => p.variants.map((v) => v.sku));
    expect(new Set(skus).size).toBe(skus.length);
  });
  it("relacionados no incluyen el propio producto", () => {
    const p = demoCatalog[0]!;
    expect(relatedProducts(demoCatalog, p).some((x) => x.id === p.id)).toBe(false);
  });
  it("encuentra variante por color y talla", () => {
    const p = demoCatalog.find((x) => x.id === "tee-acm-core")!;
    expect(findVariant(p, "negro", "M")?.id).toBe("tee-acm-core-negro-m");
    expect(findVariant(p, "negro", null)).toBeNull();
  });
});
