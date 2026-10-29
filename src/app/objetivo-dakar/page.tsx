import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { RoadmapTimeline } from "@/components/sections/roadmap-timeline";
import { VideoCard } from "@/components/sections/video-card";
import { SponsorsGrid } from "@/components/sections/sponsors-grid";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { videos } from "@/content/media";
import { roadmap } from "@/content/motorsport";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Objetivo Dakar — La serie",
  description: "Objetivo Dakar: la serie documental de Andrés Cubero Moreno. De la regularidad con un Pajero de 1989 al Rally Dakar 2028, episodio a episodio.",
  path: "/objetivo-dakar",
});

export default function DakarPage() {
  const episodes = videos.filter((v) => v.series === "objetivo-dakar");
  const year = new Date().getFullYear();
  const current = roadmap.findIndex((s) => s.year === year);
  const progress = Math.round(((current < 0 ? 0 : current) + 0.5) / roadmap.length * 100);

  return (
    <>
      <PageHero
        eyebrow="Serie documental · Proyecto deportivo"
        title={<>Objetivo <span className="display-italic text-racing">Dakar</span></>}
        lead="Cómo se llega a la carrera más dura del mundo desde un taller, con un coche de 1989 y sin atajos. Una temporada cada vez."
        crumbs={[{ label: "Objetivo Dakar", href: "/objetivo-dakar" }]}
        size="lg"
      >
        <div className="mt-12 max-w-3xl">
          <div className="flex justify-between font-mono text-[0.65rem] uppercase tracking-[0.18em] text-steel">
            <span>2026 · Salida</span><span>2028 · Dakar</span>
          </div>
          <div className="mt-3 h-1.5 bg-paper/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso de la hoja de ruta">
            <div className="h-full bg-racing" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-3 text-sm text-paper/60">Etapa actual: {roadmap[Math.max(0, current)]?.events.join(" · ")}</p>
        </div>
      </PageHero>

      <section id="episodios" className="scroll-mt-24 py-24 lg:py-32" aria-labelledby="ep">
        <Container>
          <SectionHeading index="01" eyebrow="Episodios" title={<span id="ep">Temporada 1</span>} lead="Los vídeos se cargan solo al pulsar reproducir, sin cookies de terceros hasta entonces." />
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            {episodes.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}><VideoCard video={v} /></Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-midnight py-24 lg:py-32" aria-labelledby="historia">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading index="02" eyebrow="Historia" title={<span id="historia">Por qué el Dakar</span>} />
          </div>
          <div className="prose-acm lg:col-span-6 lg:col-start-7">
            <p>El Dakar no se improvisa. Hacen falta kilómetros, navegación, un coche fiable y un equipo capaz de arreglarlo a medianoche en mitad del desierto. Objetivo Dakar es el cuaderno de bitácora de ese aprendizaje.</p>
            <p>Cada temporada tiene su prueba de fuego: la regularidad de la Offroad Classic Cup, la exigencia del CERTT, la primera arena del Rallye du Maroc. Y entre carrera y carrera, el taller.</p>
            <p className="text-sm text-steel">[Texto provisional — revisar con la voz de Andrés.]</p>
          </div>
        </Container>
      </section>

      <section className="py-24 lg:py-32" aria-labelledby="ruta">
        <Container>
          <SectionHeading index="03" eyebrow="Progreso" title={<span id="ruta">La hoja de ruta</span>} />
          <RoadmapTimeline className="mt-14" />
        </Container>
      </section>

      <section className="border-t border-line py-24 lg:py-32" aria-labelledby="news">
        <Container>
          <SectionHeading index="04" eyebrow="Noticias" title={<span id="news">Desde el parque cerrado</span>} />
          <div className="mt-12 flex items-center gap-4 border border-dashed border-line-strong p-8 text-paper/60">
            <Newspaper className="size-6 shrink-0 text-steel" aria-hidden />
            <p>Las crónicas de cada prueba se publicarán aquí. El blog editorial llega en la Fase 5.</p>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-24 lg:py-32" aria-labelledby="apoya">
        <Container>
          <SectionHeading
            index="05"
            eyebrow="Apoya el proyecto"
            title={<span id="apoya">Súbete al coche</span>}
            lead="Comprando en la tienda, usando los códigos de nuestros patrocinadores o patrocinando directamente."
            action={<div className="flex flex-wrap gap-3"><ButtonLink href="/tienda">Tienda oficial</ButtonLink><ButtonLink href="/motorsport#patrocinio" variant="outline">Patrocinar</ButtonLink></div>}
          />
          <SponsorsGrid className="mt-14 border border-line" />
        </Container>
      </section>
    </>
  );
}
