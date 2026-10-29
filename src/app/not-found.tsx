import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[90vh] items-end bg-midnight">
      <Container className="pb-24 pt-40">
        <p className="text-steel">Error 404</p>
        <h1 className="t-hero mt-4 max-w-[13ch]">Te has saltado un control de paso.</h1>
        <p className="t-lead mt-6 max-w-[44ch] text-paper/70">Esta página no existe o ha cambiado de sitio. Vuelve a la última viñeta del roadbook.</p>
        <div className="mt-10 flex flex-wrap items-center gap-8">
          <ButtonLink href="/">Volver al inicio</ButtonLink>
          <ButtonLink href="/tienda" variant="text">Ir a la tienda</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
