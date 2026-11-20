import { catalog } from "@/integrations/commerce";
import { absoluteUrl } from "@/lib/site";
import { site } from "@/content/site";
import { SHIPPING_RULES } from "@/domain/cart";
import type { Product, Variant } from "@/domain/catalog";

/**
 * Feed de productos para Google Merchant Center (fichas gratuitas y anuncios de Shopping).
 * Una línea por variante (color + talla), agrupadas por producto con item_group_id, que es lo que
 * Google pide para ropa. Solo entran productos reales con foto: los demo y los de afiliado se quedan fuera.
 * En Merchant Center: Productos > Añadir productos > Feed programado > esta URL, a diario.
 */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const eur = (cents: number) => `${(cents / 100).toFixed(2)} EUR`;

const googleCategory: Partial<Record<Product["category"], string>> = {
  camisetas: "Apparel & Accessories > Clothing > Shirts & Tops",
  sudaderas: "Apparel & Accessories > Clothing > Activewear > Sweatshirts",
  gorras: "Apparel & Accessories > Clothing Accessories > Hats",
  pegatinas: "Arts & Entertainment > Hobbies & Creative Arts > Arts & Crafts > Art & Crafting Materials > Embellishments & Trims > Decorative Stickers",
};

const isApparel = (p: Product) => p.category === "camisetas" || p.category === "sudaderas" || p.category === "gorras";

function images(p: Product, v: Variant): string[] {
  const own = p.images?.[v.colorId] ?? [];
  const all = own.length ? own : Object.values(p.images ?? {}).flat();
  return [...new Set(all)].slice(0, 10).map((u) => (u.startsWith("http") ? u : absoluteUrl(u)));
}

function item(p: Product, v: Variant): string | null {
  const imgs = images(p, v);
  if (!imgs.length) return null;
  const color = p.colors.find((c) => c.id === v.colorId)?.name;
  const title = [p.name, color, v.size].filter(Boolean).join(" · ");
  const link = absoluteUrl(`/tienda/${p.slug}`);
  const lines = [
    `<g:id>${esc(v.sku || v.id)}</g:id>`,
    `<g:item_group_id>${esc(p.id)}</g:item_group_id>`,
    `<g:title>${esc(title.slice(0, 150))}</g:title>`,
    `<g:description>${esc(`${p.tagline} ${p.description}`.slice(0, 5000))}</g:description>`,
    `<g:link>${esc(link)}</g:link>`,
    `<g:image_link>${esc(imgs[0]!)}</g:image_link>`,
    ...imgs.slice(1).map((u) => `<g:additional_image_link>${esc(u)}</g:additional_image_link>`),
    `<g:availability>${v.available ? "in_stock" : "out_of_stock"}</g:availability>`,
    `<g:price>${eur(v.priceCents)}</g:price>`,
    `<g:condition>new</g:condition>`,
    `<g:brand>${esc(site.name)}</g:brand>`,
    `<g:identifier_exists>no</g:identifier_exists>`,
    `<g:product_type>${esc(`Tienda > ${p.category}${p.collection ? ` > ${p.collection}` : ""}`)}</g:product_type>`,
    ...(googleCategory[p.category] ? [`<g:google_product_category>${esc(googleCategory[p.category]!)}</g:google_product_category>`] : []),
    ...(color ? [`<g:color>${esc(color)}</g:color>`] : []),
    ...(v.size ? [`<g:size>${esc(v.size)}</g:size>`] : []),
    ...(isApparel(p) ? ["<g:gender>unisex</g:gender>", "<g:age_group>adult</g:age_group>"] : []),
    `<g:shipping><g:country>ES</g:country><g:price>${eur(v.priceCents >= SHIPPING_RULES.freeFromCents ? 0 : SHIPPING_RULES.flatCents)}</g:price></g:shipping>`,
  ];
  return `<item>${lines.join("")}</item>`;
}

export async function GET() {
  const products = (await catalog.listProducts()).filter((p) => !p.demo && p.fulfillment !== "affiliate");
  const items = products.flatMap((p) => p.variants.map((v) => item(p, v))).filter(Boolean);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>
<title>${esc(site.name)} · Tienda</title><link>${absoluteUrl("/tienda")}</link><description>${esc(site.description)}</description>
${items.join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "s-maxage=3600" } });
}
