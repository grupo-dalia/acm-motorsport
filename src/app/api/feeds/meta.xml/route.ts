import { catalog } from "@/integrations/commerce";
import { absoluteUrl } from "@/lib/site";
import { site } from "@/content/site";
import { activeCampaign } from "@/content/pricing";
import { SHIPPING_RULES } from "@/domain/cart";
import type { Product, Variant } from "@/domain/catalog";

/**
 * Catálogo para Meta (Administrador de ventas → Catálogo → Orígenes de datos → Feed programado, a diario).
 * Una línea por variante, agrupadas con item_group_id. El id es el SKU de la variante: el mismo que mandan
 * los eventos del píxel (content_ids), para que funcionen los anuncios de catálogo y el retargeting dinámico.
 * Fuera: productos demo, de afiliado y con marcas de terceros (Meta rechaza artículos con marcas sin licencia).
 */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const eur = (cents: number) => `${(cents / 100).toFixed(2)} EUR`;
const thirdPartyMarks = /mitsubishi|rallyart|ralliart|toyota|lada|red bull|monster|alonso/i;

const fbCategory: Partial<Record<Product["category"], string>> = {
  camisetas: "clothing & accessories > clothing > shirts & tops",
  sudaderas: "clothing & accessories > clothing > sweaters",
  gorras: "clothing & accessories > clothing accessories > hats",
};

function images(p: Product, v: Variant): string[] {
  const own = p.images?.[v.colorId] ?? [];
  const all = own.length ? own : Object.values(p.images ?? {}).flat();
  return [...new Set(all)].slice(0, 10).map((u) => (u.startsWith("http") ? u : absoluteUrl(u)));
}

function metaItem(p: Product, v: Variant, sale: { from: string; to: string } | null): string | null {
  const imgs = images(p, v);
  if (!imgs.length) return null;
  const color = p.colors.find((c) => c.id === v.colorId)?.name;
  const title = [p.name, color, v.size].filter(Boolean).join(" · ");
  const lines = [
    `<g:id>${esc(v.sku || v.id)}</g:id>`,
    `<g:item_group_id>${esc(p.id)}</g:item_group_id>`,
    `<g:title>${esc(title.slice(0, 200))}</g:title>`,
    `<g:description>${esc(`${p.tagline} ${p.description}`.trim().slice(0, 9999))}</g:description>`,
    `<g:availability>${v.available ? "in stock" : "out of stock"}</g:availability>`,
    `<g:condition>new</g:condition>`,
    `<g:price>${eur(v.compareAtCents ?? v.priceCents)}</g:price>`,
    ...(v.compareAtCents && sale ? [`<g:sale_price>${eur(v.priceCents)}</g:sale_price>`, `<g:sale_price_effective_date>${sale.from}/${sale.to}</g:sale_price_effective_date>`] : []),
    `<g:link>${esc(absoluteUrl(`/tienda/${p.slug}`))}</g:link>`,
    `<g:image_link>${esc(imgs[0]!)}</g:image_link>`,
    ...imgs.slice(1).map((u) => `<g:additional_image_link>${esc(u)}</g:additional_image_link>`),
    `<g:brand>${esc(site.name)}</g:brand>`,
    ...(fbCategory[p.category] ? [`<g:fb_product_category>${esc(fbCategory[p.category]!)}</g:fb_product_category>`] : []),
    ...(color ? [`<g:color>${esc(color)}</g:color>`] : []),
    ...(v.size ? [`<g:size>${esc(v.size)}</g:size>`] : []),
    `<g:shipping><g:country>ES</g:country><g:price>${eur(v.priceCents >= SHIPPING_RULES.freeFromCents ? 0 : SHIPPING_RULES.flatCents)}</g:price></g:shipping>`,
  ];
  return `<item>${lines.join("")}</item>`;
}

export async function GET() {
  const products = (await catalog.listProducts()).filter((p) => !p.demo && p.fulfillment !== "affiliate" && !thirdPartyMarks.test(p.name));
  const c = activeCampaign();
  const sale = c ? { from: c.from, to: c.to } : null;
  const items = products.flatMap((p) => p.variants.map((v) => metaItem(p, v, sale))).filter(Boolean);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0"><channel>
<title>${esc(site.name)} · Tienda</title><link>${absoluteUrl("/tienda")}</link><description>${esc(site.description)}</description>
${items.join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "s-maxage=3600" } });
}
