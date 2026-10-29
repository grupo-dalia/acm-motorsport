import type { Metadata } from "next";
import { Download, Trophy } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { RoadmapTimeline } from "@/components/sections/roadmap-timeline";
import { SponsorsGrid } from "@/components/sections/sponsors-grid";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { calendar, crew, results, vehicleSpecs } from "@/content/motorsport";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorsport — Equipo, piloto y Pajero MK1",
  description: "ACM Motorsport: equipo de rally todoterreno de Andrés Cubero Moreno con un Mitsubishi Pajero MK1 de 1989. Ficha técnica, calendario, resultados y patrocinio.",
  path: "/motorsport",
});

const groups = ["Vehículo", "Preparación", "Electrónica"] as const;

export default function MotorsportPage() {
  return (
    <>
      <PageHero
        eyebrow="ACM Motorsport · Equipo de competición"
        title={<>Un equipo <span className="display-italic text-racing">independiente</span></>}
        lead="Piloto, mecánico y productor en la misma persona. Un Pajero de 1989 preparado en casa para regularidad y rally raid, con el Dakar como meta declarada."
        crumbs={[{ label: "Motorsport", href: "/motorsport" }]}
        size="lg"
      />

      {/* Historia */}
      <section className="py-24 lg:py-32" aria-labelledby="historia">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading index="01" eyebrow="Historia" title={<span id="historia">El proyecto</span>} />
          </div>
          <div className="prose-acm lg:col-span-6 lg:col-start-7">
            <p>
              ACM Motorsport nace de un taller: el de Andrés Cubero Moreno, donde se cruzan la mecánica, la metalurgia, la carpintería y la electrónica. De ahí sale un coche de competición con alma de clásico, un Mitsubishi Pajero MK1 de 1989.
            </p>
            <p>
              La estrategia es clara y pública: una temporada de base en regularidad, el salto al Campeonato de España de Rallyes TT y al Rallye du Maroc, y el Dakar en 2028. Cada paso se documenta en la serie <em>Objetivo Dakar</em>.
            </p>
            <p className="text-sm text-steel">[Texto provisional — ampliar con la historia completa del equipo.]</p>
          </div>
        </Container>
      </section>

      {/* Equipo */}
      <section className="border-t border-line py-24 lg:py-32" aria-labelledby="equipo">
        <Container>
          <SectionHeading index="02" eyebrow="Tripulación" title={<span id="equipo">Piloto y copilotos</span>} />
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {crew.map((m, i) => (
              <li key={m.role}>
                <Reveal delay={i * 0.08}>
                  <MediaPlaceholder label={m.name ?? "Por confirmar"} caption={m.role} className="aspect-[4/5]" tone={i === 0 ? "midnight" : "surface"} />
                  <p className="eyebrow mt-5">{m.role}</p>
                  <p className="mt-1 text-xl font-semibold">{m.name ?? "Por confirmar"}</p>
                  {m.bio && <p className="mt-2 text-sm leading-relaxed text-paper/60">{m.bio}</p>}
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Vehículo */}
      <section className="bg-midnight py-24 lg:py-32" aria-labelledby="vehiculo">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading index="03" eyebrow="Vehículo" title={<span id="vehiculo">Mitsubishi Pajero MK1 · 1989</span>} lead="Azul medianoche, techo con Starlink y un tripmaster diseñado en el taller." />
            <MediaPlaceholder tone="ink" label="Pajero MK1 de competición, perfil 3/4" caption="Horizontal 3:2" className="mt-10 aspect-[3/2]" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow">Ficha técnica</p>
            {groups.map((g) => (
              <div key={g} className="mt-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-racing">{g}</p>
                <dl className="mt-3 divide-y divide-line border-y border-line">
                  {vehicleSpecs.filter((s) => s.group === g).map((s) => (
                    <div key={s.label} className="grid grid-cols-5 gap-4 py-3.5">
                      <dt className="col-span-2 text-sm text-paper/60">{s.label}</dt>
                      <dd className={`col-span-3 text-sm ${s.value ? "font-medium" : "font-mono text-xs uppercase tracking-[0.14em] text-steel"}`}>{s.value ?? "Por confirmar"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Calendario + Resultados */}
      <section className="py-24 lg:py-32" aria-labelledby="calendario">
        <Container>
          <SectionHeading index="04" eyebrow="Temporadas" title={<span id="calendario">Calendario y hoja de ruta</span>} />
          <RoadmapTimeline className="mt-14" />
          <div className="mt-16 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Calendario de competiciones</caption>
              <thead className="border-b border-line-strong font-mono text-[0.65rem] uppercase tracking-[0.18em] text-steel">
                <tr><th className="py-3 pr-4 font-normal">Temporada</th><th className="py-3 pr-4 font-normal">Prueba</th><th className="py-3 pr-4 font-normal">Fecha</th><th className="py-3 pr-4 font-normal">Lugar</th><th className="py-3 font-normal">Estado</th></tr>
              </thead>
              <tbody className="divide-y divide-line">
                {calendar.map((e) => (
                  <tr key={e.id}>
                    <td className="py-4 pr-4 font-mono">{e.season}</td>
                    <td className="py-4 pr-4 font-semibold">{e.name}</td>
                    <td className="py-4 pr-4 text-paper/70">{e.date ? formatDate(e.date) : "Por confirmar"}</td>
                    <td className="py-4 pr-4 text-paper/70">{e.location ?? "Por confirmar"}</td>
                    <td className="py-4"><Badge tone={e.status === "confirmado" ? "blue" : "neutral"}>{e.status.replace("-", " ")}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-20" id="resultados">
            <h3 className="display text-2xl">Resultados</h3>
            {results.length === 0 ? (
              <div className="mt-6 flex items-center gap-4 border border-dashed border-line-strong p-8 text-paper/60">
                <Trophy className="size-6 shrink-0 text-steel" aria-hidden />
                <p>Aún no hay clasificaciones oficiales publicadas. Aparecerán aquí con enlace a la fuente oficial de cada prueba.</p>
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      {/* Galería */}
      <section className="border-t border-line py-24 lg:py-32" aria-labelledby="galeria">
        <Container>
          <SectionHeading index="05" eyebrow="Galería" title={<span id="galeria">En el tramo</span>} />
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
            <MediaPlaceholder label="Salida de tramo" className="col-span-2 row-span-2 aspect-square md:aspect-auto" />
            <MediaPlaceholder label="Copiloto con roadbook" tone="surface" className="aspect-square" />
            <MediaPlaceholder label="Detalle tripmaster" tone="ink" className="aspect-square" />
            <MediaPlaceholder label="Parque cerrado" tone="ink" className="aspect-square" />
            <MediaPlaceholder label="Polvo y pista" tone="surface" className="aspect-square" />
          </div>
        </Container>
      </section>

      {/* Patrocinio */}
      <section id="patrocinio" className="scroll-mt-24 bg-surface py-24 lg:py-32" aria-labelledby="patro">
        <Container>
          <SectionHeading
            index="06"
            eyebrow="Patrocinio"
            title={<span id="patro">Tu marca, del taller al Dakar</span>}
            lead="Una narrativa de varios años con contenido semanal: vídeo largo, shorts, directos y redes. Visibilidad en el coche, en la serie y en la tienda."
          />
          <SponsorsGrid className="mt-14 border border-line" showDescription />
          <div className="mt-20 grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="display text-2xl">Dossier comercial</h3>
              <p className="mt-4 text-paper/70">Audiencia, formatos de activación y paquetes de patrocinio para la temporada.</p>
              <p className="mt-6 inline-flex items-center gap-2 border border-dashed border-line-strong px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-steel">
                <Download className="size-4" /> PDF en preparación
              </p>
              <p className="mt-4 text-sm text-paper/60">Mientras tanto, pídelo con el formulario y te lo enviamos.</p>
              <ButtonLink href="/contacto" variant="link" className="mt-4">Otras consultas →</ButtonLink>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <ContactForm defaultTopic="patrocinio" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
