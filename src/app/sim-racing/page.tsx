import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { ButtonLink } from "@/components/ui/button";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ACM Sim Racing — Cockpit, equipo y directos",
  description: "ACM Sim Racing: cockpit construido en el taller, equipamiento, configuraciones y directos de simulación de Andrés Cubero Moreno.",
  path: "/sim-racing",
});

const gear = [
  { k: "Volante / base", v: null },
  { k: "Pedales", v: null },
  { k: "Cambio y freno de mano", v: null },
  { k: "Pantallas / VR", v: null },
  { k: "Asiento y chasis", v: "Cockpit propio en construcción (ACM Workshop)" },
];

export default function SimRacingPage() {
  return (
    <>
      <PageHero
        eyebrow="ACM Sim Racing"
        title={<>La pista que <span className="display-italic text-racing">nunca cierra</span></>}
        lead="Simulación para entrenar reflejos, navegación y estrategia, y para disfrutar en directo con la comunidad."
        crumbs={[{ label: "Sim Racing", href: "/sim-racing" }]}
        tone="ink"
      />

      <section className="py-24 lg:py-32" aria-labelledby="cockpit">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading index="01" eyebrow="Cockpit" title={<span id="cockpit">Hecho en el taller</span>} lead="Diseño y construcción del puesto de simulación, documentado en vídeo de principio a fin." />
          </div>
          <MediaPlaceholder label="Cockpit ACM Sim Racing" caption="Render o foto del montaje" className="aspect-[4/3] lg:col-span-6" />
        </Container>
      </section>

      <section className="border-t border-line py-24 lg:py-32" aria-labelledby="equipo">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading index="02" eyebrow="Equipamiento" title={<span id="equipo">El setup</span>} lead="Los enlaces a productos serán de afiliación y se indicarán claramente." />
          </div>
          <dl className="divide-y divide-line border-y border-line lg:col-span-6 lg:col-start-7">
            {gear.map((g) => (
              <div key={g.k} className="grid grid-cols-5 gap-4 py-4">
                <dt className="col-span-2 text-sm text-paper/60">{g.k}</dt>
                <dd className={`col-span-3 text-sm ${g.v ? "font-medium" : "font-mono text-xs uppercase tracking-[0.14em] text-steel"}`}>{g.v ?? "Por confirmar"}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-surface py-24 lg:py-32" aria-labelledby="directos">
        <Container className="grid gap-px border border-line bg-line md:grid-cols-3">
          <div className="bg-ink p-8 md:col-span-2">
            <p className="eyebrow">03 · Directos</p>
            <h2 id="directos" className="display mt-4 text-[length:var(--text-display-sm)]">En vivo</h2>
            <p className="mt-4 max-w-lg text-paper/70">Sesiones de simulación y el programa ACM Motor News, en directo bajo el nombre {site.founder}.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {site.social.map((s) => <ButtonLink key={s.label} href={s.href} variant="outline" size="sm" target="_blank" rel="noopener noreferrer">{s.label}</ButtonLink>)}
            </div>
          </div>
          <div className="bg-ink p-8">
            <p className="eyebrow">04 · Configuraciones</p>
            <p className="mt-4 text-paper/70">Setups de coche y ajustes de force feedback para descargar.</p>
            <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-steel">Próximamente</p>
          </div>
          <div className="bg-ink p-8 md:col-span-3">
            <p className="eyebrow">05 · Colaboradores</p>
            <p className="mt-4 text-paper/70">Giants Software · Farming Simulator 25 — colaboración de contenido. Más colaboraciones en camino.</p>
          </div>
        </Container>
      </section>
    </>
  );
}
