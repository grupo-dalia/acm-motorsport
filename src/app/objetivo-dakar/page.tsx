import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { RouteMap } from "@/components/media/route-map";
import { Seasons } from "@/components/sections/seasons";
import { VideoCard } from "@/components/sections/video-card";
import { SponsorsList } from "@/components/sections/sponsors-list";
import { ButtonLink } from "@/components/ui/button";
import { videos } from "@/content/media";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Objetivo Dakar, la serie",
  description: "Objetivo Dakar: la serie documental de Andrés Cubero Moreno. De la regularidad con un Pajero de 1989 al Rally Dakar 2028, episodio a episodio.",
  path: "/objetivo-dakar",
});

export default function DakarPage() {
  const episodes = videos.filter((v) => v.series === "objetivo-dakar");
  return (
    <>
      <section className="relative overflow-hidden bg-midnight">
        <Container className="relative z-10 pt-28 lg:pt-40">
          <Breadcrumbs items={[{ label: "Objetivo Dakar", href: "/objetivo-dakar" }]} />
          <h1 className="t-hero mt-10 max-w-[11ch]">Objetivo Dakar</h1>
          <p className="t-lead mt-6 max-w-[40ch] text-paper/75">Cómo se llega a la carrera más dura del mundo desde un taller, con un coche de 1989 y sin atajos. Una temporada cada vez.</p>
        </Container>
        <RouteMap align="xMaxYMid" className="mt-6 aspect-[4/3] w-full sm:aspect-[16/9] lg:-mt-24" />
      </section>

      <section id="episodios" className="scroll-mt-20 bg-midnight-deep py-24 lg:py-36" aria-labelledby="ep">
        <Container>
          <SectionHeading id="ep" title="Temporada 1" lead="Los vídeos solo se cargan al pulsar reproducir: sin cookies de YouTube hasta entonces." />
          <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-8">
            {episodes.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </Container>
      </section>

      <section className="on-paper py-24 lg:py-36" aria-labelledby="historia">
        <Container className="grid gap-12 lg:grid-cols-12">
          <h2 id="historia" className="t-display lg:col-span-5">Por qué el Dakar</h2>
          <div className="prose-acm text-lg text-slate lg:col-span-6 lg:col-start-7">
            <p>El Dakar no se improvisa. Hacen falta kilómetros, navegación, un coche fiable y alguien capaz de arreglarlo a medianoche en mitad del desierto. Objetivo Dakar es el cuaderno de bitácora de ese aprendizaje.</p>
            <p>Cada temporada tiene su prueba de fuego: la regularidad de la Offroad Classic Cup, la exigencia del CERTT, la primera arena del Rallye du Maroc. Y entre carrera y carrera, el taller.</p>
            <p className="t-small">Texto provisional, pendiente de la voz de Andrés.</p>
          </div>
        </Container>
      </section>

      <section className="bg-midnight py-24 lg:py-36" aria-labelledby="ruta">
        <Container>
          <h2 id="ruta" className="t-display">La hoja de ruta</h2>
          <Seasons className="mt-16" />
          <p className="mt-16 max-w-[60ch] text-paper/70">Las crónicas de cada prueba se publicarán aquí en cuanto arranque la temporada.</p>
        </Container>
      </section>

      <section className="on-paper py-24 lg:py-36" aria-labelledby="apoya">
        <Container>
          <SectionHeading
            id="apoya"
            title="Súbete al coche"
            lead="Comprando en la tienda, usando los códigos de nuestros patrocinadores o patrocinando directamente."
            action={<div className="flex flex-wrap items-center gap-6"><ButtonLink href="/tienda" variant="dark">Ir a la tienda</ButtonLink><ButtonLink href="/motorsport#patrocinio" variant="text">Patrocinar</ButtonLink></div>}
          />
          <SponsorsList className="mt-14" />
        </Container>
      </section>
    </>
  );
}
