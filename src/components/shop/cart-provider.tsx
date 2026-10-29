"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { cartReducer, cartSchema, emptyCart, priceCart, cartCount, type Cart, type CartAction, type CartTotals } from "@/domain/cart";
import type { Product } from "@/domain/catalog";

const STORAGE_KEY = "acm.cart.v1";

type CartContextValue = {
  cart: Cart;
  totals: CartTotals;
  count: number;
  hydrated: boolean;
  dispatch: (a: CartAction) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  catalog: Product[];
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Carrito persistente en localStorage (solo IDs y cantidades, validado con Zod al leer).
 * Los totales mostrados aquí son orientativos; el servidor recalcula en el checkout.
 */
export function CartProvider({ children, catalog }: { children: ReactNode; catalog: Product[] }) {
  const [cart, dispatch] = useReducer(cartReducer, emptyCart);
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);
  const skipPersist = useRef(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = cartSchema.safeParse(JSON.parse(raw));
        if (parsed.success) dispatch({ type: "hydrate", cart: parsed.data });
      }
    } catch {
      /* almacenamiento no disponible: carrito en memoria */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronización única con localStorage tras montar (evita desajustes de hidratación)
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* ignorar */
    }
  }, [cart, hydrated]);

  const stableDispatch = useCallback((a: CartAction) => dispatch(a), []);
  const totals = useMemo(() => priceCart(cart, catalog), [cart, catalog]);

  const value = useMemo<CartContextValue>(
    () => ({ cart, totals, count: cartCount(cart), hydrated, dispatch: stableDispatch, open, setOpen, catalog }),
    [cart, totals, hydrated, stableDispatch, open, catalog],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
