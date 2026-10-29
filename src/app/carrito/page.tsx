import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CartView } from "@/components/shop/cart-view";

export const metadata: Metadata = { title: "Carrito", robots: { index: false } };

export default function CartPage() {
  return (
    <Container className="pb-24 pt-24 lg:pt-32">
      <Breadcrumbs items={[{ label: "Tienda", href: "/tienda" }, { label: "Carrito", href: "/carrito" }]} />
      <h1 className="display mt-8 text-[length:var(--text-display-md)]">Carrito</h1>
      <div className="mt-10"><CartView /></div>
    </Container>
  );
}
