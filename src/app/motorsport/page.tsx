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
type Photo = { src: string; alt: string; pos?: string };
/** Trayectoria por temporadas, de lo más reciente a lo más antiguo. */
const trayectoria: { id: string; kicker: string; title: string; text: string; photos: Photo[] }[] = [
  {
    id: "selva-2026",
    kicker: "2026 · Off-Road Classic Cup · 9 de mayo",
    title: "VII Clàssic Raid La Selva",
    text: "Arbúcies, pistas de bosque y el dragón rojo en el capó.",
    photos: [
      { src: "/media/selva-frontal.jpg", alt: "El Pajero con los faros encendidos en La Selva" },
      { src: "/media/selva-salida-euro4x4parts.jpg", alt: "Salida bajo el arco de Euro4x4parts en Arbúcies" },
      { src: "/media/selva-bandera-salida.jpg", alt: "Bandera de salida en La Selva", pos: "50% 60%" },
      { src: "/media/selva-frontal-2.jpg", alt: "El Pajero en un tramo de tierra en La Selva" },
      { src: "/media/selva-lateral-22.jpg", alt: "El Pajero con el dorsal 22 en una curva" },
      { src: "/media/selva-pista-faros.jpg", alt: "El Pajero entre la vegetación con los faros encendidos" },
      { src: "/media/selva-pista-faros-2.jpg", alt: "El Pajero bajando por una pista de tierra roja" },
      { src: "/media/selva-trasera.jpg", alt: "El Pajero visto desde atrás en la pista" },
      { src: "/media/selva-trasera-curva.jpg", alt: "El Pajero tomando una curva en el bosque" },
    ],
  },
  {
    id: "salou-2026",
    kicker: "2026 · Off-Road Classic Cup · 11 de abril",
    title: "I Clàssic Raid Salou",
    text: "Vados, piedra suelta y vistas al Camp de Tarragona.",
    photos: [
      { src: "/media/salou-vadeo.jpg", alt: "El Pajero cruzando un vado en Salou" },
      { src: "/media/salou-205-valle.jpg", alt: "El Pajero con el dorsal 205 bajando hacia el valle" },
      { src: "/media/salou-dorsal-21.jpg", alt: "El Pajero con el dorsal 21 en una pista de piedra" },
      { src: "/media/salou-bandera-salida.jpg", alt: "Bandera de salida en Salou" },
      { src: "/media/andres-dorsal-21-salou.jpg", alt: "Andrés junto al dorsal 21 en Salou" },
    ],
  },
  {
    id: "garrotxa-2026",
    kicker: "2026 · Off-Road Classic Cup · 21 de febrero",
    title: "II Clàssic Raid La Garrotxa",
    text: "Vuelta a las carreras en Besalú: 22.º y premio a la mejor debutante para Anaïs Soriano.",
    photos: [
      { src: "/media/garrotxa-pajero-tramo.jpg", alt: "Andrés y Anaïs Soriano en tramo en La Garrotxa" },
      { src: "/media/anais-soriano-mejor-debutante.jpg", alt: "Anaïs Soriano con el premio a la mejor debutante", pos: "50% 35%" },
      { src: "/media/garrotxa-vadeo.jpg", alt: "El Pajero cruzando un vado en La Garrotxa" },
      { src: "/media/garrotxa-205-polvo.jpg", alt: "El Pajero entre el polvo" },
      { src: "/media/garrotxa-dorsal-16.jpg", alt: "Andrés pegando el dorsal 16", pos: "55% 40%" },
      { src: "/media/garrotxa-salida.jpg", alt: "Salida con la bandera catalana en Besalú" },
      { src: "/media/garrotxa-arco-salida.jpg", alt: "El Pajero bajo el arco de Euro4x4parts", pos: "50% 60%" },
      { src: "/media/garrotxa-parque.jpg", alt: "El Pajero en la fila antes de la salida", pos: "50% 55%" },
      { src: "/media/andres-besalu-garrotxa.jpg", alt: "Andrés en Besalú el día de la carrera" },
    ],
  },
  {
    id: "2025",
    kicker: "2025",
    title: "Un año sin carreras",
    text: "Tocó parar. Por qué, lo cuento en el capítulo piloto de Objetivo Dakar.",
    photos: [],
  },
  {
    id: "certt-2024",
    kicker: "2024 · Campeonato de España de Rallyes TT",
    title: "El debut: CERTT",
    text: "5.º en el Rallye TT Jaén Mar de Olivos a la primera. Después, Lorca, el Cierzo y Cuenca.",
    photos: [
      { src: "/media/cierzo-2024.jpg", alt: "El Pajero levantando arena en el VI Cierzo Rally Ejército de Tierra" },
      { src: "/media/jaen-mar-de-olivos-2024-salida.jpg", alt: "Salida del Rallye TT Jaén Mar de Olivos 2024", pos: "50% 62%" },
      { src: "/media/jaen-2024-asistencia.jpg", alt: "El Pajero en la carpa de asistencia en Jaén", pos: "50% 60%" },
      { src: "/media/pajero-pista-montana.jpg", alt: "El Pajero levantando polvo en Lorca", pos: "62% 60%" },
      { src: "/media/cierzo-2024-barro.jpg", alt: "El Pajero saliendo del barro bajo un puente en el Cierzo" },
      { src: "/media/certt-2024-derrape.jpg", alt: "El Pajero derrapando en tierra" },
      { src: "/media/certt-2024-tierra-roja-1.jpg", alt: "El Pajero en un tramo de tierra roja" },
      { src: "/media/certt-2024-tierra-roja-2.jpg", alt: "El Pajero con el dorsal 205 en tramo" },
      { src: "/media/certt-2024-tierra-roja-3.jpg", alt: "El Pajero de frente entre pinos" },
    ],
  },
  {
    id: "fuera",
    kicker: "Fuera de carrera",
    title: "El Pajero, el taller y el karting",
    text: "Lo que no sale en las clasificaciones.",
    photos: [
      { src: "/media/pajero-montana.jpg", alt: "El Pajero en un prado de alta montaña" },
      { src: "/media/pajero-atardecer.jpg", alt: "El Pajero al atardecer sobre un valle de olivos" },
      { src: "/media/pajero-noche.jpg", alt: "El Pajero de noche, recién lavado", pos: "50% 55%" },
      { src: "/media/andres-euro4x4parts-hilux.jpg", alt: "Andrés junto a la Hilux de Euro4x4parts con tienda de techo", pos: "30% 50%" },
      { src: "/media/karting-58.jpg", alt: "Andrés en karting con el número 58", pos: "50% 70%" },
      { src: "/media/karting-grupo.jpg", alt: "Varios karts en una curva" },
      { src: "/media/taller-euro4x4parts.jpg", alt: "Andrés en el taller", pos: "50% 35%" },
      { src: "/media/liberador-avm.jpg", alt: "Liberador AVM montado en el Pajero" },
      { src: "/media/taller-lampara-itv.jpg", alt: "Puesta a punto del Pajero antes de la ITV" },
    ],
  },
];

const statusText = { "por-confirmar": "Fecha por confirmar", confirmado: "Confirmado", disputado: "Disputado" } as const;

export default function MotorsportPage() {
  return (
    <>
      <PageHero
        title="Un equipo independiente."
        lead="Piloto, mecánico y productor en la misma persona. Un Pajero de 1989 preparado en casa para regularidad y rally raid."
        crumbs={[{ label: "Motorsport", href: "/motorsport" }]}
        media={<MediaPlaceholder label="El Pajero cruzando un vado en el Clàssic Raid La Garrotxa" src="/media/garrotxa-vadeo.jpg" position="55% 45%" priority className="aspect-[4/3] w-full sm:aspect-[21/9] lg:max-h-[78vh]" />}
      />

      <section className="on-paper py-24 lg:py-36" aria-labelledby="historia">
        <Container className="grid gap-12 lg:grid-cols-12">
          <h2 id="historia" className="t-display lg:col-span-5">Cómo empezó</h2>
          <div className="prose-acm text-lg text-slate lg:col-span-6 lg:col-start-7">
            <p>ACM Motorsport nace de un taller donde se cruzan la mecánica, el metal, la madera y la electrónica. De ahí sale un coche de competición con alma de clásico: un Mitsubishi Pajero MK1 de 1989.</p>
            <p>El debut llegó en 2024, en el Campeonato de España de Rallyes TT: quinto en el Rallye TT Jaén Mar de Olivos a la primera, y después Lorca, Cierzo y Cuenca. En 2025 tocó parar. En 2026, la Off-Road Classic Cup de regularidad; en 2027, vuelta al CERTT y el Rallye du Maroc; y en 2028, el Dakar. Cada paso se cuenta en la serie Objetivo Dakar.</p>
          </div>
        </Container>
      </section>

      <section className="on-paper pb-24 lg:pb-36" aria-labelledby="equipo">
        <Container>
          <h2 id="equipo" className="t-display">Tripulación</h2>
          <ul className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
            {crew.filter((m) => m.name).map((m) => (
              <li key={m.role}>
                <MediaPlaceholder label={m.name ?? m.role} src={m.image ?? undefined} position={m.imagePosition ?? "50% 30%"} sizes="(min-width:768px) 33vw, 100vw" tone={m.name ? "night" : "light"} className="aspect-[4/5]" />
                <p className="t-sub mt-5">{m.name}</p>
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
            <p className="t-lead mt-6 text-paper/70">Batalla larga, motor 4D56, Starlink en el techo y un tripmaster diseñado en el taller.</p>
          </div>
          <div className="space-y-12 lg:col-span-7 lg:col-start-6">
            {groups.filter((g) => vehicleSpecs.some((s) => s.group === g && s.value)).map((g) => (
              <div key={g}>
                <h3 className="t-sub">{g}</h3>
                <dl className="mt-4 border-t border-line">
                  {vehicleSpecs.filter((s) => s.group === g && s.value).map((s) => (
                    <div key={s.label} className="grid grid-cols-5 gap-4 border-b border-line py-4">
                      <dt className="col-span-2 text-steel">{s.label}</dt>
                      <dd className="col-span-3">{s.value}</dd>
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
              <caption className="t-sub mb-6 text-left">Todas las pruebas</caption>
              <thead className="t-small text-steel">
                <tr className="border-b border-line"><th className="py-3 pr-4 font-normal">Temporada</th><th className="py-3 pr-4 font-normal">Prueba</th><th className="py-3 pr-4 font-normal">Fecha</th><th className="py-3 font-normal">Lugar</th></tr>
              </thead>
              <tbody>
                {calendar.map((e) => (
                  <tr key={e.id} className="border-b border-line">
                    <td className="py-4 pr-4 tnum">{e.season}</td>
                    <td className="py-4 pr-4 font-medium">{e.name}</td>
                    <td className="py-4 pr-4 text-paper/70">{e.date ? formatDate(e.date) : statusText[e.status]}</td>
                    <td className="py-4 text-paper/70">{e.location ?? "—"}</td>
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
                      <p className="t-small text-steel">{r.category} · {r.date}{r.note ? ` · ${r.note}` : ""}</p>
                    </div>
                    {r.source && <a href={r.source} target="_blank" rel="noopener noreferrer" className="link-u t-small md:col-span-3 md:text-right">Ver el capítulo</a>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </section>

      <section className="bg-midnight py-24 lg:py-36" aria-labelledby="galeria">
        <Container>
          <h2 id="galeria" className="t-display">Trayectoria</h2>
          <p className="t-lead mt-6 max-w-[48ch] text-paper/70">Del debut en el CERTT a la regularidad en Cataluña. Carrera a carrera, con las fotos de cada una.</p>
          <nav aria-label="Temporadas" className="mt-10 flex flex-wrap gap-2">
            {trayectoria.map((t) => <a key={t.id} href={`#${t.id}`} className="rounded-full bg-paper/10 px-4 py-2 t-small hover:bg-paper/20">{t.title}</a>)}
          </nav>
          <div className="mt-16 space-y-24">
            {trayectoria.map((t) => (
              <article key={t.id} id={t.id} className="scroll-mt-24">
                <p className="t-small text-steel">{t.kicker}</p>
                <h3 className="t-title mt-2">{t.title}</h3>
                <p className="mt-2 max-w-[60ch] text-paper/70">{t.text}</p>
                {t.photos.length > 0 && <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {t.photos.map((ph, i) => (
                    <MediaPlaceholder key={ph.src} label={ph.alt} src={ph.src} position={ph.pos ?? "50% 50%"} sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"} className={i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"} />
                  ))}
                </div>}
              </article>
            ))}
          </div>
          <p className="mt-10 t-small text-steel">Fotos de carrera: fotógrafos oficiales de cada prueba.</p>
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
