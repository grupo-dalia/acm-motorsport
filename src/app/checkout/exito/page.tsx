import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/shop/clear-cart";
import { stripe } from "@/integrations/payments/stripe";
import { catalog } from "@/integrations/commerce";
import { TrackPurchase } from "@/components/analytics/track-purchase";
import type { CommerceData } from "@/lib/meta-pixel";

export const metadata: Metadata = { title: "Pedido recibido", robots: { index: false } };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ pedido?: string; demo?: string; session_id?: string }> }) {
  const { pedido, demo, session_id } = await searchParams;
  const safeId = pedido && /^[A-Z0-9-]{6,40}$/.test(pedido) ? pedido : null;
  // Con Stripe, comprobamos el estado real de la sesión (el pedido se confirma por webhook).
  let pending = false;
  let purchase: CommerceData | null = null;
  if (!demo && session_id && /^cs_[A-Za-z0-9_]+$/.test(session_id)) {
    try {
      const s = await stripe().checkout.sessions.retrieve(session_id);
      pending = s.payment_status !== "paid" || (safeId !== null && s.client_reference_id !== safeId);
      // Purchase de Meta (navegador) con el importe real cobrado por Stripe.
      if (!pending && safeId && s.amount_total != null) {
        const items = await stripe().checkout.sessions.listLineItems(session_id, { limit: 100, expand: ["data.price.product"] });
        const variants = (await catalog.listProducts()).flatMap((p) => p.variants);
        const contents = items.data.map((li) => {
          const product = li.price?.product;
          const variantId = product && typeof product === "object" && !("deleted" in product && product.deleted) ? (product.metadata?.variant ?? "") : "";
          const id = variants.find((v) => v.id === variantId)?.sku || variantId || li.id;
          return { id, quantity: li.quantity ?? 1, itemPriceCents: li.quantity ? Math.round(li.amount_total / li.quantity) : li.amount_total };
        });
        purchase = { contentIds: contents.map((c) => c.id), valueCents: s.amount_total, numItems: contents.reduce((n, c) => n + c.quantity, 0), contents };
      }
    } catch {
      pending = true;
    }
  }
  return (
    <div className="on-paper"><Container className="flex min-h-[85vh] flex-col justify-end pb-24 pt-40">
      <ClearCartOnMount />
      {purchase && safeId && <TrackPurchase orderReference={safeId} data={purchase} />}
      <p className="text-slate">{demo ? "Pedido de prueba creado · no se ha cobrado nada" : pending ? "Pago en proceso" : "Pedido confirmado"}</p>
      <h1 className="t-hero mt-4 max-w-[12ch]">Gracias por empujar.</h1>
      {safeId && <p className="mt-6">Referencia <strong className="tnum">{safeId}</strong></p>}
      <p className="t-lead mt-4 max-w-[46ch] text-slate">
        {demo
          ? "Así se verá la confirmación cuando la tienda esté activa: recibirás un email con el resumen y te avisaremos al enviarse."
          : pending
            ? "Estamos esperando la confirmación del pago. En cuanto llegue te enviaremos un email con el resumen."
            : "Te hemos enviado un email con el resumen del pedido, y Stripe te manda la factura aparte."}
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-8">
        <ButtonLink href="/objetivo-dakar" variant="dark">Seguir el proyecto</ButtonLink>
        <ButtonLink href="/tienda" variant="text">Volver a la tienda</ButtonLink>
      </div>
    </Container></div>
  );
}
