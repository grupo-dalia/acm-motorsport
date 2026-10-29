import Link from "next/link";
import type { Product } from "@/domain/catalog";
import { fulfillmentLabels } from "@/domain/catalog";
import { ProductArt } from "./product-art";
import { formatPrice } from "@/lib/format";

export function ProductCard({ product }: { product: Product; priority?: boolean }) {
  const first = product.colors[0];
  const soldOut = product.fulfillment !== "affiliate" && !product.variants.some((v) => v.available);
  return (
    <article className="group relative">
      <Link href={`/tienda/${product.slug}`} className="absolute inset-0 z-10" aria-label={product.name} />
      <div className="overflow-hidden rounded-[6px]">
        <ProductArt kind={product.art.kind} print={product.art.print} color={first?.hex ?? "#111"} className="aspect-[4/5] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]" />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-medium">{product.name}</h3>
        <p className="shrink-0 tnum">{product.fulfillment === "affiliate" ? "Tienda externa" : formatPrice(product.priceCents)}</p>
      </div>
      <p className="mt-1 t-small opacity-60">
        {soldOut ? "Agotado" : fulfillmentLabels[product.fulfillment].short}
        {product.colors.length > 1 && ` · ${product.colors.length} colores`}
      </p>
    </article>
  );
}
