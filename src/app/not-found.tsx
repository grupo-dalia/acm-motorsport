import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Contours } from "@/components/media/contours";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[90vh] items-center overflow-hidden bg-midnight">
      <Contours className="absolute inset-0 -z-10 h-full w-full text-[#7f9cd1]/25" />
      <Container className="py-32">
        <p className="eyebrow">Error 404 · Fuera de ruta</p>
        <h1 className="display mt-6 text-[length:var(--text-display-lg)]">Te has saltado <span className="display-italic text-racing">un CP</span></h1>
        <p className="mt-6 max-w-lg text-lg text-paper/70">La página que buscas no existe o ha cambiado de sitio. Vuelve a la última viñeta del roadbook.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Volver al inicio</ButtonLink>
          <ButtonLink href="/tienda" variant="outline">Tienda</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
