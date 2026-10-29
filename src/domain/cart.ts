import { z } from "zod";
import type { Product } from "./catalog";

/**
 * Carrito: estado mínimo en cliente (solo IDs y cantidades).
 * Los precios se recalculan SIEMPRE en servidor a partir del catálogo.
 */
export const MAX_QTY = 10;

export const cartLineSchema = z.object({
  productId: z.string().min(1).max(80),
  variantId: z.string().min(1).max(120),
  qty: z.number().int().min(1).max(MAX_QTY),
});
export const cartSchema = z.object({ lines: z.array(cartLineSchema).max(50), coupon: z.string().max(40).nullable().default(null) });

export type CartLine = z.infer<typeof cartLineSchema>;
export type Cart = z.infer<typeof cartSchema>;

export const emptyCart: Cart = { lines: [], coupon: null };

export type CartAction =
  | { type: "add"; line: CartLine }
  | { type: "setQty"; variantId: string; qty: number }
  | { type: "remove"; variantId: string }
  | { type: "coupon"; code: string | null }
  | { type: "clear" }
  | { type: "hydrate"; cart: Cart };

export function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "add": {
      const existing = state.lines.find((l) => l.variantId === action.line.variantId);
      if (existing) {
        return {
          ...state,
          lines: state.lines.map((l) => (l.variantId === action.line.variantId ? { ...l, qty: Math.min(MAX_QTY, l.qty + action.line.qty) } : l)),
        };
      }
      return { ...state, lines: [...state.lines, { ...action.line, qty: Math.min(MAX_QTY, action.line.qty) }] };
    }
    case "setQty":
      if (action.qty <= 0) return { ...state, lines: state.lines.filter((l) => l.variantId !== action.variantId) };
      return { ...state, lines: state.lines.map((l) => (l.variantId === action.variantId ? { ...l, qty: Math.min(MAX_QTY, action.qty) } : l)) };
    case "remove":
      return { ...state, lines: state.lines.filter((l) => l.variantId !== action.variantId) };
    case "coupon":
      return { ...state, coupon: action.code };
    case "clear":
      return emptyCart;
    case "hydrate":
      return action.cart;
  }
}

/** Reglas de envío de DEMOSTRACIÓN. Sustituir por tarifas reales del proveedor en Fase 4. */
export const SHIPPING_RULES = { flatCents: 495, freeFromCents: 6000 } as const;

/** Cupones de DEMOSTRACIÓN. En Fase 3 se leen de la tabla `coupons`. */
export const DEMO_COUPONS: Record<string, { percent: number; label: string }> = {
  DEMO10: { percent: 0.1, label: "Cupón de prueba −10 %" },
};

export type PricedLine = CartLine & {
  name: string;
  slug: string;
  variantLabel: string;
  unitCents: number;
  totalCents: number;
  fulfillment: Product["fulfillment"];
};

export type CartTotals = {
  lines: PricedLine[];
  invalid: CartLine[];
  subtotalCents: number;
  discountCents: number;
  shippingCents: number;
  totalCents: number;
  coupon: { code: string; label: string } | null;
};

/** Precio autoritativo del carrito a partir del catálogo. Las líneas no válidas se separan. */
export function priceCart(cart: Cart, catalog: Product[]): CartTotals {
  const lines: PricedLine[] = [];
  const invalid: CartLine[] = [];
  for (const line of cart.lines) {
    const product = catalog.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant || !variant.available || product.fulfillment === "affiliate") {
      invalid.push(line);
      continue;
    }
    const color = product.colors.find((c) => c.id === variant.colorId);
    lines.push({
      ...line,
      name: product.name,
      slug: product.slug,
      variantLabel: [color?.name, variant.size].filter(Boolean).join(" · "),
      unitCents: variant.priceCents,
      totalCents: variant.priceCents * line.qty,
      fulfillment: product.fulfillment,
    });
  }
  const subtotalCents = lines.reduce((s, l) => s + l.totalCents, 0);
  const couponDef = cart.coupon ? DEMO_COUPONS[cart.coupon.toUpperCase()] : undefined;
  const discountCents = couponDef ? Math.round(subtotalCents * couponDef.percent) : 0;
  const afterDiscount = subtotalCents - discountCents;
  const shippingCents = lines.length === 0 || afterDiscount >= SHIPPING_RULES.freeFromCents ? 0 : SHIPPING_RULES.flatCents;
  return {
    lines,
    invalid,
    subtotalCents,
    discountCents,
    shippingCents,
    totalCents: afterDiscount + shippingCents,
    coupon: couponDef && cart.coupon ? { code: cart.coupon.toUpperCase(), label: couponDef.label } : null,
  };
}

export function cartCount(cart: Cart) {
  return cart.lines.reduce((s, l) => s + l.qty, 0);
}
