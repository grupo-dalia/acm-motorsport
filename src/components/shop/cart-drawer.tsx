"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "./cart-provider";
import { ProductArt } from "./product-art";
import { formatPrice } from "@/lib/format";
import { SHIPPING_RULES } from "@/domain/cart";
import { buttonVariants } from "@/components/ui/button";

export function CartDrawer() {
  const { open, setOpen, totals, dispatch, catalog } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [open, setOpen]);

  const remaining = SHIPPING_RULES.freeFromCents - (totals.subtotalCents - totals.discountCents);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div className="absolute inset-0 bg-ink/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Cesta"
            className="on-paper absolute inset-y-0 right-0 flex w-full max-w-md flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <p className="t-sub">Cesta</p>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="font-medium text-slate hover:text-ink">Cerrar</button>
            </div>

            {totals.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-5 px-6">
                <p className="t-title">Tu cesta está vacía.</p>
                <Link href="/tienda" onClick={() => setOpen(false)} className={buttonVariants({ variant: "dark" })}>Ir a la tienda</Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-6 overflow-y-auto px-6 py-2">
                  {totals.lines.map((line) => {
                    const product = catalog.find((p) => p.id === line.productId);
                    const color = product?.colors.find((c) => c.id === product.variants.find((v) => v.id === line.variantId)?.colorId);
                    return (
                      <li key={line.variantId} className="flex gap-4">
                        {product && <ProductArt kind={product.art.kind} print={product.art.print} color={color?.hex ?? "#111"} className="size-24 shrink-0 rounded-[4px]" showDemoTag={false} />}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-3">
                            <Link href={`/tienda/${line.slug}`} onClick={() => setOpen(false)} className="font-medium hover:underline">{line.name}</Link>
                            <span className="tnum">{formatPrice(line.totalCents)}</span>
                          </div>
                          <span className="t-small text-slate">{line.variantLabel}</span>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-[var(--radius-btn)] bg-mist">
                              <button type="button" className="grid size-8 place-items-center" onClick={() => dispatch({ type: "setQty", variantId: line.variantId, qty: line.qty - 1 })} aria-label={`Quitar una unidad de ${line.name}`}><Minus className="size-3.5" /></button>
                              <span className="w-6 text-center t-small tnum">{line.qty}</span>
                              <button type="button" className="grid size-8 place-items-center" onClick={() => dispatch({ type: "setQty", variantId: line.variantId, qty: line.qty + 1 })} aria-label={`Añadir una unidad de ${line.name}`}><Plus className="size-3.5" /></button>
                            </div>
                            <button type="button" onClick={() => dispatch({ type: "remove", variantId: line.variantId })} className="t-small text-slate hover:text-racing">Quitar</button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="space-y-4 border-t border-line-dark px-6 py-6">
                  <p className="t-small text-slate">{remaining > 0 ? `Te faltan ${formatPrice(remaining)} para el envío gratis.` : "Tienes el envío gratis."}</p>
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tnum font-medium">{formatPrice(totals.subtotalCents)}</span>
                  </div>
                  <Link href="/checkout" onClick={() => setOpen(false)} className={buttonVariants({ size: "lg", className: "w-full" })}>Finalizar compra</Link>
                  <Link href="/carrito" onClick={() => setOpen(false)} className="block text-center t-small text-slate hover:text-ink">Ver la cesta completa</Link>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
