import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { VideoCard } from "@/components/sections/video-card";
import { videos, workshopProjects } from "@/content/media";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "ACM Workshop: mecánica, fabricación y proyectos",
  description: "ACM Workshop: mecánica 4x4, fabricación, electrónica y restauración. Proyectos del Pajero, tutoriales, herramientas recomendadas y recursos descargables.",
  path: "/workshop",
});

export default function WorkshopPage() {
  const [lead, ...rest] = workshopProjects;
  return (
    <>
      <PageHero
        title="Lo que no existe, se fabrica."
        lead="Mecánica, metal, madera y electrónica. El taller donde se prepara el coche de competición y donde nacen los proyectos del canal."
        crumbs={[{ label: "Workshop", href: "/workshop" }]}
      />

      <section className="on-paper py-24 lg:py-36" aria-labelledby="proyectos">
        <Container>
          <h2 id="proyectos" className="t-display">En el banco de trabajo</h2>
          {lead && (
            <article className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-end">
              <MediaPlaceholder label={lead.title} className="aspect-[4/3] lg:col-span-7" />
              <div className="lg:col-span-4 lg:col-start-9">
                <p className={cn("t-small", lead.status === "En curso" ? "text-racing" : "text-slate")}>{lead.status} · {lead.category}</p>
                <h3 className="t-title mt-3">{lead.title}</h3>
                <p className="mt-3 text-slate">{lead.summary}</p>
              </div>
            </article>
          )}
          <ul className="mt-20 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <li key={p.id}>
                <MediaPlaceholder label={p.title} tone="light" className="aspect-[4/3]" />
                <p className={cn("t-small mt-5", p.status === "En curso" ? "text-racing" : "text-slate")}>{p.status} · {p.category}</p>
                <h3 className="t-sub mt-2">{p.title}</h3>
                <p className="mt-2 text-slate">{p.summary}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-midnight py-24 lg:py-36" aria-labelledby="videos">
        <Container>
          <SectionHeading id="videos" title="Del taller a la pantalla" />
          <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-8">
            {videos.filter((v) => v.series === "workshop").map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </Container>
      </section>

      <section className="bg-midnight-deep py-24 lg:py-32" aria-labelledby="recursos">
        <Container>
          <h2 id="recursos" className="t-title">Próximamente en el taller</h2>
          <dl className="mt-10 grid gap-10 border-t border-line pt-10 md:grid-cols-3">
            {[
              ["Artículos y tutoriales", "Guías paso a paso de los trabajos que salen en el canal."],
              ["Herramientas recomendadas", "Lo que se usa de verdad en el taller, con los enlaces de afiliación señalados."],
              ["Recursos descargables", "Esquemas, plantillas y archivos de los proyectos, como el módulo de regularidad."],
            ].map(([t, d]) => (
              <div key={t}>
                <dt className="t-sub">{t}</dt>
                <dd className="mt-2 text-paper/70">{d}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}
