"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/format";
import { SHIPPING_RULES } from "@/domain/cart";

export function OrderSummary({ editableCoupon = true }: { editableCoupon?: boolean }) {
  const { totals, cart, dispatch } = useCart();
  const [code, setCode] = useState(cart.coupon ?? "");
  const [msg, setMsg] = useState<string | null>(null);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    dispatch({ type: "coupon", code: c || null });
    setMsg(c ? null : "Cupón eliminado.");
  }

  const invalidCoupon = cart.coupon && !totals.coupon;

  return (
    <div className="border border-line bg-surface p-6">
      <p className="display text-xl">Resumen</p>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-paper/70">Subtotal</dt><dd className="font-mono">{formatPrice(totals.subtotalCents)}</dd></div>
        {totals.discountCents > 0 && (
          <div className="flex justify-between text-gold"><dt>{totals.coupon?.label}</dt><dd className="font-mono">−{formatPrice(totals.discountCents)}</dd></div>
        )}
        <div className="flex justify-between">
          <dt className="text-paper/70">Envío <span className="text-steel">(demo)</span></dt>
          <dd className="font-mono">{totals.shippingCents === 0 ? "Gratis" : formatPrice(totals.shippingCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-base">
          <dt className="font-semibold">Total</dt>
          <dd className="font-mono font-semibold">{formatPrice(totals.totalCents)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-steel">IVA (21 %) incluido. Envío gratuito desde {formatPrice(SHIPPING_RULES.freeFromCents)}.</p>
      {editableCoupon && (
        <form onSubmit={apply} className="mt-6 flex gap-2">
          <label htmlFor="coupon" className="sr-only">Cupón</label>
          <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Cupón (prueba: DEMO10)" className="h-11 min-w-0 flex-1 border border-line-strong bg-ink px-3 font-mono text-sm uppercase placeholder:normal-case placeholder:text-paper/35 focus:border-paper focus:outline-none" />
          <button type="submit" className="h-11 border border-line-strong px-4 text-xs font-semibold uppercase tracking-[0.1em] hover:border-paper">Aplicar</button>
        </form>
      )}
      {invalidCoupon && <p role="alert" className="mt-2 text-xs text-racing">El cupón «{cart.coupon}» no es válido.</p>}
      {msg && <p className="mt-2 text-xs text-steel">{msg}</p>}
    </div>
  );
}
