import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClearCartOnMount } from "@/components/shop/clear-cart";

export const metadata: Metadata = { title: "Pedido recibido", robots: { index: false } };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ pedido?: string; demo?: string }> }) {
  const { pedido, demo } = await searchParams;
  const safeId = pedido && /^[A-Z0-9-]{6,40}$/.test(pedido) ? pedido : null;
  return (
    <Container className="flex min-h-[80vh] flex-col items-center justify-center py-32 text-center">
      <ClearCartOnMount />
      <CheckCircle2 className="size-14 text-racing" aria-hidden />
      {demo && <Badge tone="amber" className="mt-8">Pedido de demostración · no se ha cobrado nada</Badge>}
      <h1 className="display mt-6 text-[length:var(--text-display-md)]">¡Gracias por empujar!</h1>
      {safeId && <p className="mt-4 font-mono text-paper/70">Referencia: <strong className="text-paper">{safeId}</strong></p>}
      <p className="mt-4 max-w-lg text-paper/65">
        {demo
          ? "Así se verá la confirmación cuando la tienda esté activa: recibirás un email con el resumen y te avisaremos al enviarse."
          : "Te hemos enviado un email con el resumen del pedido."}
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/objetivo-dakar">Seguir el proyecto</ButtonLink>
        <ButtonLink href="/tienda" variant="outline">Volver a la tienda</ButtonLink>
      </div>
    </Container>
  );
}
