"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/shop/cart-provider";
import type { Product } from "@/domain/catalog";

export function Providers({ children, catalog }: { children: ReactNode; catalog: Product[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider catalog={catalog}>{children}</CartProvider>
    </MotionConfig>
  );
}
