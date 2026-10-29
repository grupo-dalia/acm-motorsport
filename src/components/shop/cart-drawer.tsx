"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "./cart-provider";
import { ProductArt } from "./product-art";
import { formatPrice } from "@/lib/format";
import { SHIPPING_RULES } from "@/domain/cart";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
          <motion.div className="absolute inset-0 bg-ink/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-line bg-surface"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="display text-xl">Carrito</p>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)} className="grid size-10 place-items-center text-paper/70 hover:text-paper" aria-label="Cerrar carrito">
                <X className="size-5" />
              </button>
            </div>

            {totals.lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="text-paper/60">Tu carrito está vacío.</p>
                <Link href="/tienda" onClick={() => setOpen(false)} className={buttonVariants({ variant: "outline" })}>
                  Explorar tienda
                </Link>
              </div>
            ) : (
              <>
                {remaining > 0 && (
                  <p className="border-b border-line bg-midnight/50 px-5 py-2.5 text-xs text-paper/75">
                    Te faltan <strong className="text-paper">{formatPrice(remaining)}</strong> para el envío gratuito <span className="text-steel">(tarifa demo)</span>.
                  </p>
                )}
                <ul className="flex-1 divide-y divide-line overflow-y-auto">
                  {totals.lines.map((line) => {
                    const product = catalog.find((p) => p.id === line.productId);
                    const variant = product?.variants.find((v) => v.id === line.variantId);
                    const color = product?.colors.find((c) => c.id === variant?.colorId);
                    return (
                      <li key={line.variantId} className="flex gap-4 px-5 py-4">
                        {product && (
                          <ProductArt kind={product.art.kind} print={product.art.print} color={color?.hex ?? "#111"} className="size-20 shrink-0" showDemoTag={false} />
                        )}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <Link href={`/tienda/${line.slug}`} onClick={() => setOpen(false)} className="truncate font-semibold hover:text-racing">
                            {line.name}
                          </Link>
                          <span className="text-xs text-steel">{line.variantLabel}</span>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center border border-line">
                              <button type="button" className="grid size-8 place-items-center hover:bg-paper/5" onClick={() => dispatch({ type: "setQty", variantId: line.variantId, qty: line.qty - 1 })} aria-label={`Quitar una unidad de ${line.name}`}>
                                <Minus className="size-3" />
                              </button>
                              <span className="w-8 text-center font-mono text-sm" aria-live="polite">{line.qty}</span>
                              <button type="button" className="grid size-8 place-items-center hover:bg-paper/5" onClick={() => dispatch({ type: "setQty", variantId: line.variantId, qty: line.qty + 1 })} aria-label={`Añadir una unidad de ${line.name}`}>
                                <Plus className="size-3" />
                              </button>
                            </div>
                            <span className="font-mono text-sm">{formatPrice(line.totalCents)}</span>
                            <button type="button" onClick={() => dispatch({ type: "remove", variantId: line.variantId })} className="text-steel hover:text-racing" aria-label={`Eliminar ${line.name}`}>
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="space-y-3 border-t border-line px-5 py-5">
                  <div className="flex justify-between text-sm text-paper/70">
                    <span>Subtotal</span>
                    <span className="font-mono">{formatPrice(totals.subtotalCents)}</span>
                  </div>
                  <p className="text-xs text-steel">IVA incluido. Envío y cupones en el siguiente paso.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link href="/carrito" onClick={() => setOpen(false)} className={cn(buttonVariants({ variant: "outline" }))}>
                      Ver carrito
                    </Link>
                    <Link href="/checkout" onClick={() => setOpen(false)} className={cn(buttonVariants())}>
                      Pagar
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
