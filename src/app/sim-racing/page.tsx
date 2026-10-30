import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "ACM Sim Racing: cockpit, equipo y directos",
  description: "ACM Sim Racing: cockpit construido en el taller, equipamiento, configuraciones y directos de simulación de Andrés Cubero Moreno.",
  path: "/sim-racing",
});

const gear: [string, string | null][] = [
  ["Volante y base", null],
  ["Pedales", null],
  ["Cambio y freno de mano", null],
  ["Pantallas o VR", null],
  ["Asiento y chasis", "Cockpit propio, en construcción en ACM Workshop"],
];

export default function SimRacingPage() {
  return (
    <>
      <PageHero
        title="La pista que nunca cierra."
        lead="Simulación para entrenar reflejos, navegación y estrategia, y para disfrutar en directo con la comunidad."
        crumbs={[{ label: "Sim Racing", href: "/sim-racing" }]}
      />

      <section className="on-paper py-24 lg:py-36" aria-labelledby="cockpit">
        <Container className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="cockpit" className="t-display">El setup</h2>
            <p className="t-lead mt-6 text-slate">Diseño y construcción del puesto de simulación, documentado en vídeo de principio a fin. Los enlaces a productos serán de afiliación y estarán señalados.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
          <dl className="border-t border-line-dark">
            {gear.filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="grid grid-cols-5 gap-4 border-b border-line-dark py-4">
                <dt className="col-span-2 text-slate">{k}</dt>
                <dd className="col-span-3">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="pt-4 text-slate">El resto del equipo aparecerá aquí cuando el cockpit esté terminado.</p>
          </div>
        </Container>
      </section>

      <section className="bg-midnight py-24 lg:py-36" aria-labelledby="directos">
        <Container className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="directos" className="t-display">En directo</h2>
            <p className="t-lead mt-6 max-w-[42ch] text-paper/70">Sesiones de simulación y el programa ACM Motor News, en directo como {site.founder}.</p>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {site.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="link-u text-lg">{s.label}</a></li>)}
            </ul>
          </div>
          <dl className="space-y-10 lg:col-span-5 lg:col-start-8">
            <div className="border-t border-line pt-6">
              <dt className="t-sub">Configuraciones</dt>
              <dd className="mt-2 text-paper/70">Setups de coche y ajustes de force feedback para descargar. Próximamente.</dd>
            </div>
            <div className="border-t border-line pt-6">
              <dt className="t-sub">Colaboraciones</dt>
              <dd className="mt-2 text-paper/70">Giants Software y Farming Simulator 25, en contenido de simulación.</dd>
            </div>
          </dl>
        </Container>
      </section>
    </>
  );
}
