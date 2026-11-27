"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BadgeCheck, Lock, Minus, Plus, Truck } from "lucide-react";
import type { Product } from "@/domain/catalog";
import { findVariant, fulfillmentLabels } from "@/domain/catalog";
import { MAX_QTY, SHIPPING_RULES } from "@/domain/cart";
import { deliveryWindow, formatDeliveryWindow } from "@/domain/shipping";
import { ProductArt } from "./product-art";
import { ProductVisual } from "./product-visual";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { trackPixel } from "@/lib/meta-pixel";

export function ProductPurchase({ product }: { product: Product }) {
  const { dispatch, setOpen } = useCart();
  const [colorId, setColorId] = useState(product.colors[0]?.id ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const sizesRef = useRef<HTMLFieldSetElement>(null);

  // Fecha de entrega con el día de hoy del visitante (la ficha es estática).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- depende de la fecha del navegador
    setEta(formatDeliveryWindow(deliveryWindow()));
  }, []);

  // Barra fija de compra en el móvil cuando el botón principal ya no se ve.
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e!.isIntersecting && e!.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];
  const needsSize = Boolean(product.sizes?.length);
  const variant = useMemo(() => (needsSize && !size ? null : findVariant(product, colorId, size)), [product, colorId, size, needsSize]);
  const isAffiliate = product.fulfillment === "affiliate";

  function add() {
    if (needsSize && !size) {
      setError("Elige una talla para continuar.");
      sizesRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!variant || !variant.available) return setError("Esta combinación no está disponible.");
    setError(null);
    dispatch({ type: "add", line: { productId: product.id, variantId: variant.id, qty } });
    trackPixel("AddToCart", { contentIds: [variant.sku || variant.id], valueCents: variant.priceCents * qty, numItems: qty, contents: [{ id: variant.sku || variant.id, quantity: qty, itemPriceCents: variant.priceCents }] });
    setOpen(true);
  }

  const photos = product.images?.[color?.id ?? ""] ?? Object.values(product.images ?? {})[0] ?? [];
  const views = photos.length
    ? photos.map((_, i) => ({ label: i === 0 ? "Producto" : `Vista ${i + 1}`, node: <ProductVisual product={product} colorId={color?.id} index={i} priority={i === 0} sizes="(min-width: 1024px) 58vw, 100vw" className="h-full w-full" /> }))
    : [
    { label: "Diseño", node: <ProductArt kind={product.art.kind} print={product.art.print} color={color?.hex ?? "#111"} className="h-full w-full" /> },
    { label: "Foto de producto", node: <MediaPlaceholder tone="light" label={`${product.name}, foto de producto`} className="h-full w-full" /> },
    { label: "En uso", node: <MediaPlaceholder label={`${product.name} en el taller o en carrera`} className="h-full w-full" /> },
      ];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <div className="aspect-[4/5] overflow-hidden rounded-[6px]">{views[Math.min(view, views.length - 1)]!.node}</div>
        <div className="mt-4 flex gap-2" role="tablist" aria-label="Imágenes del producto">
          {views.map((v, i) => (
            <button key={v.label} type="button" role="tab" aria-selected={view === i} onClick={() => setView(i)} className={cn("rounded-full px-4 py-2 t-small font-medium transition-colors", view === i ? "bg-ink text-paper" : "bg-mist text-slate hover:text-ink")}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <p className="t-small text-slate">{fulfillmentLabels[product.fulfillment].short}{product.demo && " · producto de ejemplo"}</p>
          <h1 className="t-display mt-3 text-[clamp(2rem,3.4vw,3.2rem)]">{product.name}</h1>
          <p className="t-lead mt-3 text-slate">{product.tagline}</p>
          {!isAffiliate && (() => {
            const was = variant ? variant.compareAtCents : product.compareAtCents;
            return (
              <div className="mt-8">
                {was && product.saleLabel ? <p className="t-small inline-block bg-racing px-2 py-0.5 font-semibold uppercase tracking-wide text-white">{product.saleLabel}</p> : null}
                <p className="t-title mt-2 tnum">
                  {was ? <s className="mr-3 font-normal opacity-60">{formatPrice(was)}</s> : null}
                  <span className={was ? "text-racing" : undefined}>{formatPrice(variant?.priceCents ?? product.priceCents)}</span>{" "}
                  <span className="t-small font-normal text-slate">IVA incluido</span>
                </p>
              </div>
            );
          })()}

          {!isAffiliate && (
            <div className="mt-10 space-y-8 border-t border-line-dark pt-8">
              <fieldset>
                <legend className="font-medium">Color <span className="font-normal text-slate">· {color?.name}</span></legend>
                <div className="mt-3 flex flex-wrap gap-3">
                  {product.colors.map((c) => (
                    <label key={c.id} className="cursor-pointer">
                      <input type="radio" name="color" value={c.id} checked={colorId === c.id} onChange={() => setColorId(c.id)} className="peer sr-only" />
                      <span className="block size-10 rounded-full p-[3px] ring-1 ring-line-dark peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-racing">
                        <span className="block size-full rounded-full ring-1 ring-black/10" style={{ backgroundColor: c.hex }} />
                      </span>
                      <span className="sr-only">{c.name}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {needsSize && (
                <fieldset ref={sizesRef}>
                  <legend className="font-medium">Talla</legend>
                  <div className="mt-3 grid grid-cols-6 gap-2">
                    {product.sizes!.map((s) => {
                      const disabled = !findVariant(product, colorId, s)?.available;
                      return (
                        <label key={s} className={disabled ? "cursor-not-allowed" : "cursor-pointer"}>
                          <input type="radio" name="size" value={s} disabled={disabled} checked={size === s} onChange={() => { setSize(s); setError(null); }} className="peer sr-only" />
                          <span className={cn("grid h-11 place-items-center rounded-[var(--radius-btn)] tnum transition-colors peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-racing", disabled ? "bg-mist/60 text-slate/50 line-through" : "bg-mist hover:bg-[#d9dfe8]")}>{s}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div ref={buyRef} className="flex gap-3">
                <div className="flex h-14 items-center rounded-[var(--radius-btn)] bg-mist">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-full w-11 place-items-center" aria-label="Quitar una unidad"><Minus className="size-4" /></button>
                  <span className="w-6 text-center tnum" aria-live="polite">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="grid h-full w-11 place-items-center" aria-label="Añadir una unidad"><Plus className="size-4" /></button>
                </div>
                <Button size="lg" className="flex-1" onClick={add} disabled={variant ? !variant.available : false}>
                  {variant && !variant.available ? "No disponible" : "Añadir a la cesta"}
                </Button>
              </div>
              {error && <p role="alert" className="-mt-4 text-racing">{error}</p>}
              <ul className="space-y-2.5 rounded-[6px] bg-mist p-4 t-small">
                <li className="flex gap-2.5"><Truck className="mt-0.5 size-4 shrink-0 text-racing" aria-hidden />
                  <span><b className="font-semibold">Pídela hoy y recíbela {eta ?? "en 5 a 11 días laborables"}.</b> Se imprime para ti al hacer el pedido.</span></li>
                <li className="flex gap-2.5"><Truck className="mt-0.5 size-4 shrink-0 text-transparent" aria-hidden />
                  <span>Envío {formatPrice(SHIPPING_RULES.flatCents)} · <b className="font-semibold">gratis desde {formatPrice(SHIPPING_RULES.freeFromCents)}</b>{(variant?.priceCents ?? product.priceCents) * 3 >= SHIPPING_RULES.freeFromCents ? " (con 3 prendas ya lo tienes)" : ""}.</span></li>
                <li className="flex gap-2.5"><BadgeCheck className="mt-0.5 size-4 shrink-0 text-racing" aria-hidden />
                  <span>Si llega con algún fallo, te mandamos otra o te devolvemos el dinero. 14 días para devolverla.</span></li>
                <li className="flex gap-2.5"><Lock className="mt-0.5 size-4 shrink-0 text-racing" aria-hidden />
                  <span>Pago seguro con tarjeta, Apple Pay o Google Pay.</span></li>
              </ul>
            </div>
          )}

          {!isAffiliate && (
            <div aria-hidden={!showBar} className={cn("fixed inset-x-0 bottom-0 z-[60] flex items-center gap-3 border-t border-line-dark bg-paper/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden", showBar ? "translate-y-0" : "translate-y-full")}>
              <div className="min-w-0 flex-1">
                <p className="truncate t-small font-medium">{product.name}</p>
                <p className="tnum t-small">
                  {(variant ? variant.compareAtCents : product.compareAtCents) ? <s className="mr-1.5 opacity-60">{formatPrice((variant ? variant.compareAtCents : product.compareAtCents)!)}</s> : null}
                  <b className="text-racing">{formatPrice(variant?.priceCents ?? product.priceCents)}</b>
                </p>
              </div>
              <Button size="md" tabIndex={showBar ? 0 : -1} onClick={add} disabled={variant ? !variant.available : false}>
                {needsSize && !size ? "Elegir talla" : "Añadir a la cesta"}
              </Button>
            </div>
          )}

          {isAffiliate && product.affiliate && (
            <div className="mt-10 rounded-[6px] bg-mist p-6">
              <p>{fulfillmentLabels.affiliate.long}</p>
              {product.affiliate.url ? (
                <a href={product.affiliate.url} target="_blank" rel="sponsored noopener noreferrer" className="mt-5 inline-flex h-12 items-center rounded-[var(--radius-btn)] bg-ink px-6 font-medium text-paper">Ver en {product.affiliate.partner}</a>
              ) : (
                <p className="mt-3 t-small text-slate">{product.affiliate.disclosure}</p>
              )}
            </div>
          )}

          <div className="mt-10 border-t border-line-dark pt-8">
            <p className="leading-relaxed text-slate">{product.description}</p>
            <ul className="mt-5 space-y-1.5 t-small text-slate">
              {product.details.map((d) => <li key={d}>{d}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
