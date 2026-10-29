import type { Metadata } from "next";
import { FileDown, Hammer, BookOpen } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { VideoCard } from "@/components/sections/video-card";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { videos, workshopProjects } from "@/content/media";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ACM Workshop — Mecánica, fabricación y proyectos",
  description: "ACM Workshop: mecánica 4x4, fabricación, electrónica y restauración. Proyectos del Pajero, tutoriales, herramientas recomendadas y recursos descargables.",
  path: "/workshop",
});

export default function WorkshopPage() {
  return (
    <>
      <PageHero
        eyebrow="ACM Workshop"
        title={<>Lo que no existe, <span className="display-italic text-racing">se fabrica</span></>}
        lead="Mecánica, metal, madera y electrónica. El taller donde se prepara el coche de competición y donde nacen los proyectos del canal."
        crumbs={[{ label: "Workshop", href: "/workshop" }]}
        tone="ink"
      />

      <section className="py-24 lg:py-32" aria-labelledby="proyectos">
        <Container>
          <SectionHeading index="01" eyebrow="Proyectos" title={<span id="proyectos">En el banco de trabajo</span>} />
          <ul className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {workshopProjects.map((p, i) => (
              <li key={p.id}>
                <Reveal delay={(i % 3) * 0.06}>
                  <MediaPlaceholder label={p.title} tone={i % 2 ? "surface" : "midnight"} className="aspect-[4/3]" />
                  <div className="mt-5 flex items-center gap-2">
                    <Badge tone={p.status === "En curso" ? "amber" : p.status === "Terminado" ? "blue" : "neutral"}>{p.status}</Badge>
                    <Badge>{p.category}</Badge>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{p.summary}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line py-24 lg:py-32" aria-labelledby="videos">
        <Container>
          <SectionHeading index="02" eyebrow="Vídeos relacionados" title={<span id="videos">Del taller a la pantalla</span>} />
          <div className="mt-14 grid gap-12 md:grid-cols-2">
            {videos.filter((v) => v.series === "workshop").map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-24 lg:py-32">
        <Container className="grid gap-px border border-line bg-line md:grid-cols-3">
          {[
            { icon: BookOpen, t: "Artículos y tutoriales", d: "Guías paso a paso de los trabajos del canal. Llegan con el blog editorial (Fase 5)." },
            { icon: Hammer, t: "Herramientas recomendadas", d: "Lo que usamos de verdad en el taller, con enlaces de afiliación identificados." },
            { icon: FileDown, t: "Recursos descargables", d: "Esquemas, plantillas y archivos de los proyectos (p. ej. el módulo de regularidad)." },
          ].map((x) => (
            <div key={x.t} className="bg-ink p-8">
              <x.icon className="size-6 text-racing" aria-hidden />
              <h3 className="mt-5 text-lg font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">{x.d}</p>
              <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-steel">Próximamente</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
