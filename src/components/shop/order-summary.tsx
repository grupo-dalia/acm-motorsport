"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";
import { formatPrice } from "@/lib/format";
import { SHIPPING_RULES } from "@/domain/cart";

export function OrderSummary({ editableCoupon = true }: { editableCoupon?: boolean }) {
  const { totals, cart, dispatch } = useCart();
  const [code, setCode] = useState(cart.coupon ?? "");

  function apply(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    dispatch({ type: "coupon", code: c || null });
  }

  const invalidCoupon = cart.coupon && !totals.coupon;

  return (
    <div className="rounded-[6px] bg-mist p-6">
      <p className="t-sub">Resumen</p>
      <dl className="mt-6 space-y-3">
        <div className="flex justify-between"><dt className="text-slate">Subtotal</dt><dd className="tnum">{formatPrice(totals.subtotalCents)}</dd></div>
        {totals.discountCents > 0 && <div className="flex justify-between"><dt className="text-slate">{totals.coupon?.label}</dt><dd className="tnum">−{formatPrice(totals.discountCents)}</dd></div>}
        <div className="flex justify-between"><dt className="text-slate">Envío</dt><dd className="tnum">{totals.shippingCents === 0 ? "Gratis" : formatPrice(totals.shippingCents)}</dd></div>
        <div className="flex justify-between border-t border-line-dark pt-4 t-sub"><dt>Total</dt><dd className="tnum">{formatPrice(totals.totalCents)}</dd></div>
      </dl>
      <p className="mt-2 t-small text-slate">IVA incluido. Envío gratis desde {formatPrice(SHIPPING_RULES.freeFromCents)} (tarifa de ejemplo).</p>
      {editableCoupon && (
        <form onSubmit={apply} className="mt-6 flex gap-2">
          <label htmlFor="coupon" className="sr-only">Código de descuento</label>
          <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Código de descuento" className="h-11 min-w-0 flex-1 rounded-[var(--radius-btn)] bg-paper px-3 uppercase placeholder:normal-case placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-ink/20" />
          <button type="submit" className="h-11 rounded-[var(--radius-btn)] bg-ink px-4 font-medium text-paper">Aplicar</button>
        </form>
      )}
      {editableCoupon && <p className="mt-2 t-small text-slate">Para probar, usa DEMO10.</p>}
      {invalidCoupon && <p role="alert" className="mt-2 t-small text-racing">El código {cart.coupon} no es válido.</p>}
    </div>
  );
}
