"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./cart-provider";
import { ProductArt } from "./product-art";
import { OrderSummary } from "./order-summary";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { fulfillmentLabels } from "@/domain/catalog";

export function CartView() {
  const { totals, dispatch, catalog, hydrated } = useCart();

  if (!hydrated) return <div className="h-64 animate-pulse bg-surface" aria-busy="true" aria-label="Cargando carrito" />;

  if (totals.lines.length === 0)
    return (
      <div className="border border-dashed border-line-strong px-6 py-24 text-center">
        <p className="display text-3xl">Carrito vacío</p>
        <p className="mt-3 text-paper/60">Aún no has añadido nada. El parque cerrado te espera.</p>
        <Link href="/tienda" className={buttonVariants({ className: "mt-8" })}>Ir a la tienda</Link>
      </div>
    );

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <ul className="divide-y divide-line border-y border-line lg:col-span-8">
        {totals.lines.map((line) => {
          const product = catalog.find((p) => p.id === line.productId);
          const color = product?.colors.find((c) => product.variants.find((v) => v.id === line.variantId)?.colorId === c.id);
          return (
            <li key={line.variantId} className="flex gap-5 py-6">
              {product && <ProductArt kind={product.art.kind} print={product.art.print} color={color?.hex ?? "#111"} className="size-28 shrink-0 sm:size-32" showDemoTag={false} />}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex justify-between gap-4">
                  <Link href={`/tienda/${line.slug}`} className="font-semibold hover:text-racing">{line.name}</Link>
                  <span className="font-mono">{formatPrice(line.totalCents)}</span>
                </div>
                <span className="text-sm text-steel">{line.variantLabel}</span>
                <span className="text-xs text-paper/50">{fulfillmentLabels[line.fulfillment].short} · {formatPrice(line.unitCents)}/ud.</span>
                <div className="mt-auto flex items-center gap-4 pt-3">
                  <div className="flex items-center border border-line">
                    <button type="button" className="grid size-9 place-items-center hover:bg-paper/5" onClick={() => dispatch({ type: "setQty", variantId: line.variantId, qty: line.qty - 1 })} aria-label="Menos"><Minus className="size-3.5" /></button>
                    <span className="w-9 text-center font-mono text-sm">{line.qty}</span>
                    <button type="button" className="grid size-9 place-items-center hover:bg-paper/5" onClick={() => dispatch({ type: "setQty", variantId: line.variantId, qty: line.qty + 1 })} aria-label="Más"><Plus className="size-3.5" /></button>
                  </div>
                  <button type="button" className="inline-flex items-center gap-1.5 text-sm text-steel hover:text-racing" onClick={() => dispatch({ type: "remove", variantId: line.variantId })}>
                    <Trash2 className="size-4" /> Eliminar
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <OrderSummary />
          <Link href="/checkout" className={buttonVariants({ size: "lg", className: "mt-4 w-full" })}>Tramitar pedido</Link>
          <Link href="/tienda" className="mt-4 block text-center text-sm text-paper/60 hover:text-paper">Seguir comprando</Link>
        </div>
      </div>
    </div>
  );
}
