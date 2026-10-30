import Image from "next/image";
import type { Product } from "@/domain/catalog";
import { ProductArt } from "./product-art";
import { cn } from "@/lib/utils";

/** Imagen del producto: la maqueta real si existe para ese color; si no, la ilustración. */
export function ProductVisual({ product, colorId, index = 0, className, sizes = "(min-width: 1024px) 33vw, 50vw", showDemoTag, priority }: { product: Product; colorId?: string; index?: number; className?: string; sizes?: string; showDemoTag?: boolean; priority?: boolean }) {
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const src = product.images?.[color?.id ?? ""]?.[index] ?? Object.values(product.images ?? {})[0]?.[index];
  if (src)
    return (
      <div className={cn("relative overflow-hidden bg-white", className)}>
        <Image src={src} alt={`${product.name}${color ? `, ${color.name}` : ""}`} fill sizes={sizes} priority={priority} className="object-contain" />
      </div>
    );
  return <ProductArt kind={product.art.kind} print={product.art.print} color={color?.hex ?? "#111"} className={className} showDemoTag={showDemoTag} />;
}
