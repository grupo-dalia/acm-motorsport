import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { SectionHeading } from "@/components/ui/section-heading";
import { RouteMap } from "@/components/media/route-map";
import { DunesHero } from "@/components/three/dunes-hero";
import { WordReveal } from "@/components/ui/word-reveal";
import { Seasons } from "@/components/sections/seasons";
import { VideoCard } from "@/components/sections/video-card";
import { SponsorsList } from "@/components/sections/sponsors-list";
import { ButtonLink } from "@/components/ui/button";
import { getSeriesVideos, isPlaceholder } from "@/lib/youtube";
import { youtube } from "@/content/youtube";
import { JsonLd, videoListLd } from "@/lib/seo";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Objetivo Dakar, la serie",
  description: "Objetivo Dakar: la serie documental de Andrés Cubero Moreno. De la regularidad con un Pajero de 1989 al Rally Dakar 2028, episodio a episodio.",
  path: "/objetivo-dakar",
});

export default async function DakarPage() {
  const { videos: episodes } = await getSeriesVideos("objetivo-dakar");
  const real = episodes.filter((v) => !isPlaceholder(v));
  return (
    <>
      <DunesHero className="flex min-h-[100svh] flex-col">
        <Container className="pt-28 lg:pt-36">
          <Breadcrumbs items={[{ label: "Objetivo Dakar", href: "/objetivo-dakar" }]} />
        </Container>
        <Container className="mt-auto pb-20 lg:pb-28">
          <h1 className="t-hero max-w-[11ch]"><WordReveal text="Objetivo Dakar" delay={0.2} /></h1>
          <p className="t-lead mt-6 max-w-[40ch] text-paper/80">Cómo se llega a la carrera más dura del mundo desde un taller, con un coche de 1989 y sin atajos. Una temporada cada vez.</p>
        </Container>
      </DunesHero>

      <section id="episodios" className="scroll-mt-20 bg-midnight-deep py-24 lg:py-36" aria-labelledby="ep">
        <Container>
          {real.length > 0 && <JsonLd data={videoListLd(real)} />}
          <SectionHeading
            id="ep"
            title="Episodios"
            lead="Se reproducen aquí mismo y cuentan en el canal. El más reciente, primero."
            action={<a href={youtube.subscribeUrl} target="_blank" rel="noopener noreferrer" className="link-u">Suscribirme en YouTube</a>}
          />
          {episodes[0] && <div className="mt-16"><VideoCard video={episodes[0]} featured /></div>}
          {episodes.length > 1 && (
            <div className="mt-16 grid gap-14 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {episodes.slice(1).map((v) => <VideoCard key={v.id} video={v} />)}
            </div>
          )}
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
          <RouteMap align="xMaxYMid" className="mt-12 aspect-[4/3] w-full sm:aspect-[16/9]" />
          <Seasons className="mt-12" />
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
