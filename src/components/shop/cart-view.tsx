"use client";

import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { useCart } from "./cart-provider";
import { ProductArt } from "./product-art";
import { OrderSummary } from "./order-summary";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { fulfillmentLabels } from "@/domain/catalog";

export function CartView() {
  const { totals, dispatch, catalog, hydrated } = useCart();
  if (!hydrated) return <div className="h-64 animate-pulse rounded-[6px] bg-mist" aria-busy="true" aria-label="Cargando la cesta" />;
  if (totals.lines.length === 0)
    return (
      <div className="py-16">
        <p className="t-title">Tu cesta está vacía.</p>
        <p className="mt-3 text-slate">Cuando añadas algo, aparecerá aquí.</p>
        <Link href="/tienda" className={buttonVariants({ variant: "dark", className: "mt-8" })}>Ir a la tienda</Link>
      </div>
    );

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <ul className="border-t border-line-dark lg:col-span-7">
        {totals.lines.map((line) => {
          const product = catalog.find((p) => p.id === line.productId);
          const color = product?.colors.find((c) => c.id === product.variants.find((v) => v.id === line.variantId)?.colorId);
          return (
            <li key={line.variantId} className="flex gap-5 border-b border-line-dark py-6">
              {product && <ProductArt kind={product.art.kind} print={product.art.print} color={color?.hex ?? "#111"} className="size-28 shrink-0 rounded-[4px] sm:size-36" showDemoTag={false} />}
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <Link href={`/tienda/${line.slug}`} className="font-medium hover:underline">{line.name}</Link>
                  <span className="tnum">{formatPrice(line.totalCents)}</span>
                </div>
                <span className="t-small text-slate">{line.variantLabel} · {fulfillmentLabels[line.fulfillment].short}</span>
                <div className="mt-auto flex items-center gap-5 pt-3">
                  <div className="flex items-center rounded-[var(--radius-btn)] bg-mist">
                    <button type="button" className="grid size-9 place-items-center" onClick={() => dispatch({ type: "setQty", variantId: line.variantId, qty: line.qty - 1 })} aria-label="Quitar una unidad"><Minus className="size-3.5" /></button>
                    <span className="w-7 text-center tnum">{line.qty}</span>
                    <button type="button" className="grid size-9 place-items-center" onClick={() => dispatch({ type: "setQty", variantId: line.variantId, qty: line.qty + 1 })} aria-label="Añadir una unidad"><Plus className="size-3.5" /></button>
                  </div>
                  <button type="button" className="t-small text-slate hover:text-racing" onClick={() => dispatch({ type: "remove", variantId: line.variantId })}>Quitar</button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="lg:col-span-4 lg:col-start-9">
        <div className="space-y-4 lg:sticky lg:top-28">
          <OrderSummary />
          <Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full" })}>Finalizar compra</Link>
        </div>
      </div>
    </div>
  );
}
