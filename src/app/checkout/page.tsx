import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CheckoutForm } from "@/components/shop/checkout-form";

export const metadata: Metadata = { title: "Finalizar compra", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <Container className="pb-24 pt-24 lg:pt-32">
      <Breadcrumbs items={[{ label: "Carrito", href: "/carrito" }, { label: "Finalizar compra", href: "/checkout" }]} />
      <h1 className="display mt-8 text-[length:var(--text-display-md)]">Finalizar compra</h1>
      <div className="mt-10"><CheckoutForm /></div>
    </Container>
  );
}
