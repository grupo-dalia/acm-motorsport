import Link from "next/link";
import type { Product } from "@/domain/catalog";
import { fulfillmentLabels } from "@/domain/catalog";
import { ProductVisual } from "./product-visual";
import { formatPrice } from "@/lib/format";
import { Tilt } from "@/components/ui/tilt";

export function ProductCard({ product, headingLevel = 3 }: { product: Product; priority?: boolean; headingLevel?: 2 | 3 }) {
  const first = product.colors[0];
  const soldOut = product.fulfillment !== "affiliate" && !product.variants.some((v) => v.available);
  return (
    <article className="group relative">
      <Link href={`/tienda/${product.slug}`} className="block">
            <Tilt className="overflow-hidden rounded-[6px] shadow-[0_1px_2px_rgb(8_10_15/0.06)] transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-16px_rgb(8_10_15/0.35)]">
        <ProductVisual product={product} colorId={first?.id} className="aspect-[4/5]" />
      </Tilt>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        {headingLevel === 2 ? <h2 className="font-medium">{product.name}</h2> : <h3 className="font-medium">{product.name}</h3>}
        <p className="shrink-0 tnum">{product.fulfillment === "affiliate" ? "Tienda externa" : formatPrice(product.priceCents)}</p>
      </div>
      <p className="mt-1 t-small opacity-60">
        {soldOut ? "Agotado" : fulfillmentLabels[product.fulfillment].short}
        {product.colors.length > 1 && ` · ${product.colors.length} colores`}
      </p>
      </Link>
    </article>
  );
}
