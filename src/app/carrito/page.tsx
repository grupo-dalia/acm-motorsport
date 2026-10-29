import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CartView } from "@/components/shop/cart-view";

export const metadata: Metadata = { title: "Carrito", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="on-paper min-h-[80vh]"><Container className="pb-24 pt-24 lg:pt-32">
      <Breadcrumbs items={[{ label: "Tienda", href: "/tienda" }, { label: "Cesta", href: "/carrito" }]} />
      <h1 className="t-display mt-8">Cesta</h1>
      <div className="mt-10"><CartView /></div>
    </Container></div>
  );
}
