import Link from "next/link";
import { catalog } from "@/integrations/commerce";
import { ProductVisual } from "@/components/shop/product-visual";
import { formatPrice } from "@/lib/format";

/** Producto de la tienda insertado en un artículo: el puente entre el tráfico y la venta. */
export async function ProductInline({ slug }: { slug: string }) {
  const p = await catalog.getProductBySlug(slug);
  if (!p) return null;
  const color = p.colors[0];
  return (
    <aside className="my-10 grid grid-cols-[96px_1fr] items-center gap-5 rounded-[8px] border border-line-dark p-4 text-ink sm:grid-cols-[120px_1fr]" aria-label={`Producto: ${p.name}`}>
      <ProductVisual product={p} colorId={color?.id} sizes="160px" className="aspect-square rounded-[4px]" showDemoTag={false} />
      <div className="text-base">
        <p className="t-small text-slate">De la tienda del equipo</p>
        <p className="t-sub mt-1">{p.name}</p>
        <p className="mt-1 text-slate">{p.tagline}</p>
        <Link href={`/tienda/${p.slug}`} className="mt-3 inline-block font-medium">{p.fulfillment === "affiliate" ? "Ver producto" : `Comprar · ${formatPrice(p.priceCents)}`}</Link>
      </div>
    </aside>
  );
}
