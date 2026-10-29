import Link from "next/link";
import type { Product } from "@/domain/catalog";
import { fulfillmentLabels } from "@/domain/catalog";
import { ProductArt } from "./product-art";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { ArrowUpRight } from "lucide-react";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const first = product.colors[0];
  const soldOut = product.fulfillment !== "affiliate" && !product.variants.some((v) => v.available);
  return (
    <article className="group relative flex flex-col" data-priority={priority || undefined}>
      <Link href={`/tienda/${product.slug}`} className="absolute inset-0 z-10" aria-label={product.name} />
      <div className="relative overflow-hidden">
        <ProductArt kind={product.art.kind} print={product.art.print} color={first?.hex ?? "#111"} className="aspect-[4/5] transition duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.035]" />
        <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5">
          <Badge tone={product.fulfillment === "acm" ? "solid" : product.fulfillment === "pod" ? "blue" : "amber"}>{fulfillmentLabels[product.fulfillment].short}</Badge>
          {soldOut && <Badge tone="red">Agotado</Badge>}
        </div>
      </div>
      <div className="flex flex-col gap-1 pt-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug transition-colors group-hover:text-racing">{product.name}</h3>
          <p className="mt-1 truncate text-sm text-steel">{product.tagline}</p>
        </div>
        <p className="shrink-0 font-mono text-sm text-paper/90">
          {product.fulfillment === "affiliate" ? <span className="inline-flex items-center gap-1 text-paper/70">Externo <ArrowUpRight className="size-3.5" /></span> : formatPrice(product.priceCents)}
        </p>
      </div>
      {product.colors.length > 1 && (
        <ul className="mt-3 flex gap-1.5" aria-label="Colores disponibles">
          {product.colors.map((c) => (
            <li key={c.id} title={c.name} className="size-3 rounded-full border border-paper/25" style={{ backgroundColor: c.hex }}>
              <span className="sr-only">{c.name}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
