import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { toProduct } from "./printful-catalog";

const v = (id: number, color: string, size: string, price = "29.95", status = "active") => ({
  id,
  external_id: `x${id}`,
  name: `Camiseta Ruta / ${color} / ${size}`,
  retail_price: price,
  currency: "EUR",
  sku: `SKU${id}`,
  size,
  color,
  is_ignored: false,
  availability_status: status,
  product: { variant_id: 1, product_id: 71, image: `https://files.cdn.printful.com/base-${color}.png`, name: "Bella + Canvas 3001 Unisex T-Shirt" },
  files: [{ type: "preview", preview_url: `https://files.cdn.printful.com/preview-${color}.png`, thumbnail_url: null }],
});

describe("Printful → catálogo", () => {
  const p = toProduct({ id: 9, external_id: "e9", name: "Camiseta Ruta al Desierto", thumbnail_url: null, is_ignored: false }, [v(1, "Navy", "XL"), v(2, "Navy", "S"), v(3, "Black", "M", "31.95"), v(4, "Black", "L", "31.95", "discontinued")], 0)!;

  it("mapea nombre, slug, categoría y precio mínimo", () => {
    expect(p.slug).toBe("camiseta-ruta-al-desierto");
    expect(p.category).toBe("camisetas");
    expect(p.priceCents).toBe(2995);
    expect(p.fulfillment).toBe("pod");
    expect(p.demo).toBe(false);
  });

  it("agrupa colores, ordena tallas y guarda fotos por color", () => {
    expect(p.colors.map((c) => c.id)).toEqual(["navy", "black"]);
    expect(p.colors[0]!.hex).toBe("#14264a");
    expect(p.sizes).toEqual(["S", "M", "L", "XL"]);
    expect(p.images!.navy![0]).toContain("preview-Navy");
  });

  it("marca no disponibles las variantes descatalogadas y guarda el ID de Printful", () => {
    const disc = p.variants.find((x) => x.providerVariantId === "4")!;
    expect(disc.available).toBe(false);
    expect(p.variants.find((x) => x.id === "pf-1")!.providerVariantId).toBe("1");
  });

  it("descarta productos sin precio de venta", () => {
    expect(toProduct({ id: 1, external_id: "", name: "Sin precio", thumbnail_url: null, is_ignored: false }, [v(5, "Black", "M", "0")], 0)).toBeNull();
  });
});
