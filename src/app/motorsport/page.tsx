import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { Seasons } from "@/components/sections/seasons";
import { SponsorsList } from "@/components/sections/sponsors-list";
import { ContactForm } from "@/components/forms/contact-form";
import { calendar, crew, results, vehicleSpecs } from "@/content/motorsport";
import { formatDate } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Motorsport: equipo, piloto y Pajero MK1",
  description: "ACM Motorsport: equipo de rally todoterreno de Andrés Cubero Moreno con un Mitsubishi Pajero MK1 de 1989. Ficha técnica, calendario, resultados y patrocinio.",
  path: "/motorsport",
});

const groups = ["Vehículo", "Preparación", "Electrónica"] as const;
const statusText = { "por-confirmar": "Fecha por confirmar", confirmado: "Confirmado", disputado: "Disputado" } as const;

export default function MotorsportPage() {
  return (
    <>
      <PageHero
        title="Un equipo independiente."
        lead="Piloto, mecánico y productor en la misma persona. Un Pajero de 1989 preparado en casa para regularidad y rally raid."
        crumbs={[{ label: "Motorsport", href: "/motorsport" }]}
        media={<MediaPlaceholder label="El Pajero saliendo de un tramo, plano a sangre" className="aspect-[4/3] w-full sm:aspect-[21/9] lg:max-h-[78vh]" />}
      />

      <section className="on-paper py-24 lg:py-36" aria-labelledby="historia">
        <Container className="grid gap-12 lg:grid-cols-12">
          <h2 id="historia" className="t-display lg:col-span-5">Cómo empezó</h2>
          <div className="prose-acm text-lg text-slate lg:col-span-6 lg:col-start-7">
            <p>ACM Motorsport nace de un taller donde se cruzan la mecánica, el metal, la madera y la electrónica. De ahí sale un coche de competición con alma de clásico: un Mitsubishi Pajero MK1 de 1989.</p>
            <p>La hoja de ruta es pública: una temporada de base en regularidad, el salto al Campeonato de España de Rallyes TT y al Rallye du Maroc, y el Dakar en 2028. Cada paso se cuenta en la serie Objetivo Dakar.</p>
            <p className="t-small">Texto provisional, pendiente de la versión de Andrés.</p>
          </div>
        </Container>
      </section>

      <section className="on-paper pb-24 lg:pb-36" aria-labelledby="equipo">
        <Container>
          <h2 id="equipo" className="t-display">Tripulación</h2>
          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            {crew.map((m) => (
              <li key={m.role}>
                <MediaPlaceholder label={m.name ?? m.role} tone={m.name ? "night" : "light"} className="aspect-[4/5]" />
                <p className="t-sub mt-5">{m.name ?? "Por confirmar"}</p>
                <p className="mt-1 text-slate">{m.role}</p>
                {m.bio && <p className="mt-3 max-w-[40ch] t-small text-slate">{m.bio}</p>}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="vehiculo" className="scroll-mt-20 bg-midnight py-24 lg:py-36" aria-labelledby="vehiculo-title">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="vehiculo-title" className="t-display">Mitsubishi Pajero MK1, 1989</h2>
            <p className="t-lead mt-6 text-paper/70">Azul medianoche, Starlink en el techo y un tripmaster diseñado en el taller.</p>
          </div>
          <div className="space-y-12 lg:col-span-7 lg:col-start-6">
            {groups.map((g) => (
              <div key={g}>
                <h3 className="t-sub">{g}</h3>
                <dl className="mt-4 border-t border-line">
                  {vehicleSpecs.filter((s) => s.group === g).map((s) => (
                    <div key={s.label} className="grid grid-cols-5 gap-4 border-b border-line py-4">
                      <dt className="col-span-2 text-steel">{s.label}</dt>
                      <dd className={s.value ? "col-span-3" : "col-span-3 text-steel/70"}>{s.value ?? "Por confirmar"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-midnight-deep py-24 lg:py-36" aria-labelledby="calendario">
        <Container>
          <SectionHeading id="calendario" title="Temporadas y calendario" lead="Las fechas se confirman según los organizadores publican cada calendario." />
          <Seasons className="mt-16" />
          <div className="mt-20 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <caption className="t-sub mb-6 text-left">Próximas pruebas</caption>
              <thead className="t-small text-steel">
                <tr className="border-b border-line"><th className="py-3 pr-4 font-normal">Temporada</th><th className="py-3 pr-4 font-normal">Prueba</th><th className="py-3 pr-4 font-normal">Fecha</th><th className="py-3 font-normal">Lugar</th></tr>
              </thead>
              <tbody>
                {calendar.map((e) => (
                  <tr key={e.id} className="border-b border-line">
                    <td className="py-4 pr-4 tnum">{e.season}</td>
                    <td className="py-4 pr-4 font-medium">{e.name}</td>
                    <td className="py-4 pr-4 text-paper/70">{e.date ? formatDate(e.date) : statusText[e.status]}</td>
                    <td className="py-4 text-paper/70">{e.location ?? "Por confirmar"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="resultados" className="mt-20">
            <h3 className="t-sub">Resultados</h3>
            {results.length === 0 ? (
              <p className="mt-3 max-w-[60ch] text-paper/70">Todavía no hay clasificaciones oficiales. Aparecerán aquí con enlace a la fuente de cada prueba.</p>
            ) : (
              <ul className="mt-6 border-t border-line">
                {results.map((r) => (
                  <li key={r.event} className="grid gap-2 border-b border-line py-5 md:grid-cols-12 md:items-baseline">
                    <p className="t-display tnum md:col-span-2">{r.position}</p>
                    <div className="md:col-span-7">
                      <p className="t-sub">{r.event}</p>
                      <p className="t-small text-steel">{r.category} · {r.date}</p>
                    </div>
                    <a href={r.source} target="_blank" rel="noopener noreferrer" className="link-u t-small md:col-span-3 md:text-right">Ver el capítulo</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-midnight py-24 lg:py-36" aria-labelledby="galeria">
        <Container>
          <h2 id="galeria" className="t-display">En el tramo</h2>
          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
            <MediaPlaceholder label="Salida de tramo" className="col-span-2 row-span-2 aspect-square md:aspect-auto" />
            <MediaPlaceholder label="Copiloto con roadbook" tone="dust" className="aspect-square" />
            <MediaPlaceholder label="Detalle del tripmaster" className="aspect-square" />
            <MediaPlaceholder label="Parque cerrado" tone="dust" className="aspect-square" />
            <MediaPlaceholder label="Polvo y pista" className="aspect-square" />
          </div>
        </Container>
      </section>

      <section id="patrocinio" className="on-paper scroll-mt-20 py-24 lg:py-36" aria-labelledby="patro">
        <Container>
          <SectionHeading id="patro" title="Tu marca, del taller al Dakar" lead="Una historia de varios años con contenido cada semana: vídeo largo, shorts, directos y redes. Visibilidad en el coche, en la serie y en la tienda." />
          <SponsorsList className="mt-14" />
          <div className="mt-24 grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h3 className="t-title">Pide el dossier</h3>
              <p className="mt-4 text-slate">Audiencia, formatos de activación y paquetes para la temporada. El PDF está en preparación: escríbenos y te lo enviamos en cuanto esté listo.</p>
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
