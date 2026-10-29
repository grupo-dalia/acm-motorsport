"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/shop/cart-provider";
import { SmoothScroll } from "./smooth-scroll";
import type { Product } from "@/domain/catalog";

export function Providers({ children, catalog }: { children: ReactNode; catalog: Product[] }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      <CartProvider catalog={catalog}>{children}</CartProvider>
    </MotionConfig>
  );
}
