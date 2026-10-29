"use client";

import { useMemo, useState } from "react";
import { Check, ExternalLink, Minus, Plus } from "lucide-react";
import type { Product } from "@/domain/catalog";
import { findVariant, fulfillmentLabels } from "@/domain/catalog";
import { MAX_QTY } from "@/domain/cart";
import { ProductArt } from "./product-art";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProductPurchase({ product }: { product: Product }) {
  const { dispatch, setOpen } = useCart();
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const needsSize = Boolean(product.sizes?.length);
  const variant = useMemo(() => (needsSize && !size ? null : findVariant(product, colorId, size)), [product, colorId, size, needsSize]);
  const isAffiliate = product.fulfillment === "affiliate";

  function add() {
    if (needsSize && !size) {
      setError("Elige una talla.");
      return;
    }
    if (!variant || !variant.available) {
      setError("Esta combinación no está disponible.");
      return;
    }
    setError(null);
    dispatch({ type: "add", line: { productId: product.id, variantId: variant.id, qty } });
    setAdded(true);
    setOpen(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const views = [
    <ProductArt key="a" kind={product.art.kind} print={product.art.print} color={color?.hex ?? "#111"} className="h-full w-full" />,
    <div key="b" className="h-full w-full overflow-hidden">
      <ProductArt kind={product.art.kind} print={product.art.print} color={color?.hex ?? "#111"} className="h-full w-full origin-[50%_42%] scale-[1.9]" showDemoTag={false} />
    </div>,
    <MediaPlaceholder key="c" tone="surface" label={`${product.name} en uso`} caption="Foto de producto real pendiente" className="h-full w-full" />,
  ];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <div className="aspect-[4/5] w-full overflow-hidden bg-surface">{views[view]}</div>
        <div className="mt-3 grid grid-cols-3 gap-3" role="tablist" aria-label="Imágenes del producto">
          {views.map((v, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={view === i}
              aria-label={`Imagen ${i + 1}`}
              onClick={() => setView(i)}
              className={cn("aspect-square overflow-hidden border transition", view === i ? "border-paper" : "border-transparent opacity-60 hover:opacity-100")}
            >
              <div className="pointer-events-none h-full w-full [&_span]:hidden [&_figcaption]:hidden">{v}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <div className="flex flex-wrap gap-2">
            <Badge tone={product.fulfillment === "acm" ? "solid" : product.fulfillment === "pod" ? "blue" : "amber"}>{fulfillmentLabels[product.fulfillment].short}</Badge>
            {product.demo && <Badge tone="amber">Producto demo</Badge>}
          </div>
          <h1 className="display mt-5 text-[length:var(--text-display-sm)] leading-[0.95]">{product.name}</h1>
          <p className="mt-3 text-lg text-paper/70">{product.tagline}</p>
          {!isAffiliate && (
            <p className="mt-6 font-mono text-2xl">
              {formatPrice(variant?.priceCents ?? product.priceCents)} <span className="text-xs text-steel">IVA incl.</span>
            </p>
          )}

          {!isAffiliate && (
            <>
              <fieldset className="mt-8">
                <legend className="eyebrow">Color · <span className="text-paper">{color?.name}</span></legend>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {product.colors.map((c) => (
                    <label key={c.id} className="cursor-pointer">
                      <input type="radio" name="color" value={c.id} checked={colorId === c.id} onChange={() => setColorId(c.id)} className="peer sr-only" />
                      <span className="block size-10 rounded-full border-2 border-transparent p-0.5 ring-offset-2 ring-offset-ink peer-checked:border-paper peer-focus-visible:ring-2 peer-focus-visible:ring-racing">
                        <span className="block size-full rounded-full border border-paper/20" style={{ backgroundColor: c.hex }} />
                      </span>
                      <span className="sr-only">{c.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {needsSize && (
                <fieldset className="mt-7">
                  <legend className="eyebrow">Talla</legend>
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {product.sizes!.map((s) => {
                      const v = findVariant(product, colorId, s);
                      const disabled = !v?.available;
                      return (
                        <label key={s} className={cn(disabled ? "cursor-not-allowed" : "cursor-pointer")}>
                          <input type="radio" name="size" value={s} disabled={disabled} checked={size === s} onChange={() => { setSize(s); setError(null); }} className="peer sr-only" />
                          <span className={cn("grid h-11 place-items-center border font-mono text-sm transition peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-racing", disabled ? "border-line text-paper/25 line-through" : "border-line-strong hover:border-paper")}>
                            {s}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div className="mt-8 flex gap-3">
                <div className="flex h-14 items-center border border-line-strong">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-11 place-items-center hover:bg-paper/5" aria-label="Menos cantidad"><Minus className="size-4" /></button>
                  <span className="w-8 text-center font-mono" aria-live="polite" aria-label="Cantidad">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="grid h-full w-11 place-items-center hover:bg-paper/5" aria-label="Más cantidad"><Plus className="size-4" /></button>
                </div>
                <Button size="lg" className="flex-1" onClick={add} disabled={variant ? !variant.available : false}>
                  {added ? <><Check /> Añadido</> : variant && !variant.available ? "No disponible" : "Añadir al carrito"}
                </Button>
              </div>
              {error && <p role="alert" className="mt-3 text-sm text-racing">{error}</p>}
              <p className="mt-4 text-sm text-steel">{fulfillmentLabels[product.fulfillment].long}</p>
            </>
          )}

          {isAffiliate && product.affiliate && (
            <div className="mt-8 border border-gold/40 bg-gold/5 p-5">
              <p className="text-sm leading-relaxed text-paper/80">{fulfillmentLabels.affiliate.long}</p>
              {product.affiliate.url ? (
                <a href={product.affiliate.url} target="_blank" rel="sponsored noopener noreferrer" className="mt-4 inline-flex h-12 items-center gap-2 bg-paper px-6 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink">
                  Ver en {product.affiliate.partner} <ExternalLink className="size-4" />
                </a>
              ) : (
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-gold">{product.affiliate.disclosure}</p>
              )}
            </div>
          )}

          <div className="mt-10 border-t border-line pt-8">
            <p className="leading-relaxed text-paper/75">{product.description}</p>
            <ul className="mt-6 space-y-2 text-sm text-paper/70">
              {product.details.map((d) => (
                <li key={d} className="flex gap-3"><span className="mt-2 size-1 shrink-0 bg-racing" />{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
