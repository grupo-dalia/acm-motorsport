import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = { title: "Newsletter", robots: { index: false } };

const copy = {
  confirmada: { title: "Estás dentro.", text: "Suscripción confirmada. Te escribiremos cuando salga un capítulo nuevo o haya algo que contar." },
  baja: { title: "Hecho, ya no recibirás más correos.", text: "Te hemos dado de baja. Si cambias de idea, puedes volver a apuntarte desde el pie de cualquier página." },
  error: { title: "Este enlace no funciona.", text: "Puede que esté incompleto o que ya no sea válido. Prueba a apuntarte de nuevo desde el pie de la página." },
} as const;

export default async function NewsletterPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const c = copy[(estado as keyof typeof copy) in copy ? (estado as keyof typeof copy) : "error"];
  return (
    <div className="bg-midnight">
      <Container className="flex min-h-[70vh] flex-col justify-center py-32">
        <h1 className="t-hero max-w-[16ch]">{c.title}</h1>
        <p className="t-lead mt-6 max-w-[48ch] text-paper/75">{c.text}</p>
        <div className="mt-10 flex flex-wrap gap-6">
          <ButtonLink href="/objetivo-dakar">Ver Objetivo Dakar</ButtonLink>
          <ButtonLink href="/" variant="text">Volver al inicio</ButtonLink>
        </div>
      </Container>
    </div>
  );
}
