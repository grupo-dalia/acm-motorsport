import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CheckoutForm } from "@/components/shop/checkout-form";

export const metadata: Metadata = { title: "Finalizar compra", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="on-paper min-h-[80vh]"><Container className="pb-24 pt-24 lg:pt-32">
      <Breadcrumbs items={[{ label: "Cesta", href: "/carrito" }, { label: "Finalizar compra", href: "/checkout" }]} />
      <h1 className="t-display mt-8">Finalizar compra</h1>
      <div className="mt-10"><CheckoutForm /></div>
    </Container></div>
  );
}
