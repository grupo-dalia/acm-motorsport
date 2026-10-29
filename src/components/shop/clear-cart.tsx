"use client";

import { useEffect } from "react";
import { useCart } from "./cart-provider";

export function ClearCartOnMount() {
  const { dispatch, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) dispatch({ type: "clear" });
  }, [hydrated, dispatch]);
  return null;
}
