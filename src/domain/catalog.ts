/**
 * Modelo de catálogo independiente del proveedor.
 * Printful, stock propio o afiliados se mapean a este modelo mediante adaptadores.
 * Importes SIEMPRE en céntimos, IVA incluido (venta B2C en España).
 */

export type CategorySlug = "camisetas" | "sudaderas" | "gorras" | "accesorios" | "pegatinas" | "colecciones";

export const categories: { slug: CategorySlug; name: string; description: string }[] = [
  { slug: "camisetas", name: "Camisetas", description: "Algodón orgánico y cortes de equipo." },
  { slug: "sudaderas", name: "Sudaderas", description: "Para el frío de parque cerrado." },
  { slug: "gorras", name: "Gorras", description: "Bordadas, de las que aguantan polvo." },
  { slug: "accesorios", name: "Accesorios", description: "Para el taller y la carretera." },
  { slug: "pegatinas", name: "Pegatinas", description: "Vinilo exterior para coche, casco o caja de herramientas." },
  { slug: "colecciones", name: "Colecciones especiales", description: "Ediciones ligadas a momentos del proyecto." },
];

/**
 * Quién vende y quién fabrica:
 *  - acm:       stock propio, lo envía ACM.
 *  - pod:       bajo demanda (Printful). Se fabrica tras el pago.
 *  - affiliate: producto de terceros. Enlace externo; ACM puede recibir comisión.
 */
export type FulfillmentType = "acm" | "pod" | "affiliate";

export const fulfillmentLabels: Record<FulfillmentType, { short: string; long: string }> = {
  acm: { short: "Vendido por ACM", long: "Stock propio. Lo preparamos y enviamos nosotros." },
  pod: { short: "Bajo demanda", long: "Se fabrica para ti tras confirmar el pago (producción vía socio de impresión)." },
  affiliate: { short: "Afiliación", long: "Producto de un tercero. Si compras desde nuestro enlace podemos recibir una comisión, sin coste extra para ti." },
};

export type Availability = "in_stock" | "made_to_order" | "external" | "unavailable";

export type ColorOption = { id: string; name: string; hex: string };

export type ProductArtKind = "tee" | "hoodie" | "cap" | "sticker" | "mug" | "keyring" | "beanie" | "device";
export type ProductPrint = "acm" | "dakar" | "stripe" | "workshop" | "sim" | "roadbook";

export type Variant = {
  id: string;
  sku: string;
  colorId: string;
  size: string | null;
  priceCents: number;
  available: boolean;
  /** ID de variante en el proveedor (Printful sync_variant_id). null en demo. */
  providerVariantId: string | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  details: string[];
  category: CategorySlug;
  collection: string | null;
  fulfillment: FulfillmentType;
  availability: Availability;
  priceCents: number;
  /** Coste estimado de fabricación por unidad (para márgenes en admin). Nunca se expone en la ficha. */
  unitCostCents: number | null;
  vatRate: number;
  art: { kind: ProductArtKind; print: ProductPrint };
  colors: ColorOption[];
  sizes: string[] | null;
  variants: Variant[];
  featured: boolean;
  tags: string[];
  affiliate: { partner: string; url: string | null; disclosure: string } | null;
  /** true = producto de demostración, no está a la venta. */
  demo: boolean;
  /** Fotos reales por color (maquetas de Printful). Sin fotos se dibuja la ilustración de `art`. */
  images?: Record<string, string[]> | null;
};

export function buildVariants(p: Pick<Product, "id" | "colors" | "sizes" | "priceCents">, unavailable: string[] = []): Variant[] {
  const sizes = p.sizes ?? [null];
  return p.colors.flatMap((c) =>
    sizes.map((s) => {
      const id = [p.id, c.id, s].filter(Boolean).join("-").toLowerCase();
      return {
        id,
        sku: `ACM-${id.toUpperCase()}`,
        colorId: c.id,
        size: s,
        priceCents: p.priceCents,
        available: !unavailable.includes(id),
        providerVariantId: null,
      };
    }),
  );
}

export function findVariant(product: Product, colorId: string, size: string | null) {
  return product.variants.find((v) => v.colorId === colorId && v.size === size) ?? null;
}

export type ShopQuery = {
  q?: string;
  categoria?: CategorySlug;
  tipo?: FulfillmentType;
  orden?: "destacados" | "precio-asc" | "precio-desc" | "nombre";
};

/** Búsqueda y filtros puros: se usan en servidor (página de tienda) y en tests. */
export function queryProducts(products: Product[], query: ShopQuery) {
  const q = query.q?.trim().toLowerCase();
  let list = products.filter((p) => {
    if (query.categoria && p.category !== query.categoria) return false;
    if (query.tipo && p.fulfillment !== query.tipo) return false;
    if (q) {
      const hay = [p.name, p.tagline, p.description, ...p.tags].join(" ").toLowerCase();
      if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
    }
    return true;
  });
  switch (query.orden) {
    case "precio-asc":
      list = [...list].sort((a, b) => a.priceCents - b.priceCents);
      break;
    case "precio-desc":
      list = [...list].sort((a, b) => b.priceCents - a.priceCents);
      break;
    case "nombre":
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, "es"));
      break;
    default:
      list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }
  return list;
}

export function relatedProducts(products: Product[], product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id)
    .map((p) => ({
      p,
      score: (p.category === product.category ? 2 : 0) + (p.collection && p.collection === product.collection ? 3 : 0) + p.tags.filter((t) => product.tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}
