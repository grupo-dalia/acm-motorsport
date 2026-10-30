import "server-only";
import type { CategorySlug, ColorOption, Product, ProductArtKind, Variant } from "@/domain/catalog";

/**
 * Catálogo desde la tienda "Manual order platform / API" de Printful (API v1, Products API).
 * Lo que Andrés crea en Printful aparece en la web con fotos, tallas, colores y precio de venta.
 * Se cachea 10 minutos; si Printful falla, la tienda sigue con el último catálogo bueno o el demo.
 */
type PfSyncProduct = { id: number; external_id: string; name: string; thumbnail_url: string | null; is_ignored: boolean };
type PfFile = { type: string; preview_url: string | null; thumbnail_url: string | null };
type PfSyncVariant = {
  id: number;
  external_id: string;
  name: string;
  retail_price: string | null;
  currency: string;
  sku: string | null;
  size: string | null;
  color: string | null;
  is_ignored: boolean;
  availability_status: string;
  product: { variant_id: number; product_id: number; image: string; name: string };
  files: PfFile[];
};

const API = "https://api.printful.com";
const REVALIDATE = 600;

async function pf<T>(path: string, key: string, storeId?: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${key}`, ...(storeId ? { "X-PF-Store-Id": storeId } : {}) },
    next: { revalidate: REVALIDATE, tags: ["printful"] },
  });
  if (!res.ok) throw new Error(`Printful ${res.status} ${path}: ${(await res.text()).slice(0, 200)}`);
  return ((await res.json()) as { result: T }).result;
}

export async function fetchPrintfulCatalog(key: string, storeId?: string): Promise<Product[]> {
  const list: PfSyncProduct[] = [];
  for (let offset = 0; offset < 500; offset += 100) {
    const page = await pf<PfSyncProduct[]>(`/store/products?limit=100&offset=${offset}`, key, storeId);
    list.push(...page);
    if (page.length < 100) break;
  }
  const details = await Promise.all(
    list.filter((p) => !p.is_ignored).map((p) => pf<{ sync_product: PfSyncProduct; sync_variants: PfSyncVariant[] }>(`/store/products/${p.id}`, key, storeId)),
  );
  return details.map(({ sync_product, sync_variants }, i) => toProduct(sync_product, sync_variants.filter((v) => !v.is_ignored), i)).filter((p): p is Product => p !== null);
}

export function toProduct(sp: PfSyncProduct, vs: PfSyncVariant[], index: number): Product | null {
  if (!vs.length) return null;
  const baseName = vs[0]!.product.name ?? "";
  const category = guessCategory(`${baseName} ${sp.name}`);
  const colors: ColorOption[] = [];
  const sizes: string[] = [];
  const images: Record<string, string[]> = {};
  const variants: Variant[] = vs.map((v) => {
    const colorName = v.color?.trim() || "Único";
    const colorId = slug(colorName);
    if (!colors.some((c) => c.id === colorId)) colors.push({ id: colorId, name: colorName, hex: colorHex(colorName) });
    if (v.size && !sizes.includes(v.size)) sizes.push(v.size);
    const preview = v.files.find((f) => f.type === "preview")?.preview_url ?? v.product.image;
    if (preview) {
      images[colorId] ??= [];
      if (!images[colorId].includes(preview)) images[colorId].push(preview);
    }
    return {
      id: `pf-${v.id}`,
      sku: v.sku || `PF-${v.id}`,
      colorId,
      size: v.size || null,
      priceCents: Math.round(Number(v.retail_price ?? 0) * 100),
      available: v.availability_status !== "discontinued" && v.availability_status !== "out_of_stock" && Number(v.retail_price ?? 0) > 0,
      providerVariantId: String(v.id),
    };
  });
  const prices = variants.filter((v) => v.priceCents > 0).map((v) => v.priceCents);
  if (!prices.length) return null;
  return {
    id: `pf-${sp.id}`,
    slug: slug(sp.name),
    name: sp.name,
    tagline: "",
    description: `${sp.name}. Se fabrica bajo demanda cuando haces el pedido, así no sobra nada en un almacén.`,
    details: ["Fabricado bajo demanda tras confirmar el pago", baseName ? `Prenda base: ${baseName}` : ""].filter(Boolean),
    category,
    collection: null,
    fulfillment: "pod",
    availability: "made_to_order",
    priceCents: Math.min(...prices),
    unitCostCents: null,
    vatRate: 0.21,
    art: { kind: artKind(category), print: "acm" },
    colors,
    sizes: sizes.length > 1 || (sizes[0] && sizes[0] !== "One size") ? sortSizes(sizes) : null,
    variants,
    featured: index < 4,
    tags: [],
    affiliate: null,
    demo: false,
    images,
  };
}

function guessCategory(name: string): CategorySlug {
  const n = name.toLowerCase();
  if (/hoodie|sweatshirt|sudadera|crewneck/.test(n)) return "sudaderas";
  if (/cap|hat|gorra|beanie|snapback|trucker/.test(n)) return "gorras";
  if (/sticker|pegatina/.test(n)) return "pegatinas";
  if (/t-shirt|tee|camiseta|tank|shirt/.test(n)) return "camisetas";
  return "accesorios";
}

function artKind(c: CategorySlug): ProductArtKind {
  return c === "sudaderas" ? "hoodie" : c === "gorras" ? "cap" : c === "pegatinas" ? "sticker" : c === "camisetas" ? "tee" : "mug";
}

const ORDER = ["XS", "S", "M", "L", "XL", "2XL", "XXL", "3XL", "4XL", "5XL"];
function sortSizes(s: string[]) {
  return [...s].sort((a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99));
}

function slug(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80) || "producto";
}

/** Colores habituales del catálogo de Printful; el resto, gris neutro. */
function colorHex(name: string) {
  const n = name.toLowerCase();
  const map: [RegExp, string][] = [
    [/black|negro/, "#0b0d12"], [/navy|marino|midnight/, "#14264a"], [/white|blanco/, "#eef1f5"], [/sand|arena|khaki|beige|natural|bone/, "#cbb895"],
    [/red|rojo/, "#c81f2e"], [/grey|gray|gris|heather/, "#8a8f99"], [/olive|military|army/, "#5b5e3a"], [/blue|azul/, "#2c5aa0"], [/green|verde/, "#2f6b45"], [/brown|marr/, "#6b4a32"],
  ];
  return map.find(([r]) => r.test(n))?.[1] ?? "#9299a7";
}
