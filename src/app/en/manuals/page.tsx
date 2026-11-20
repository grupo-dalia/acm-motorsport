import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Free 4x4 workshop manuals: Mitsubishi Pajero / Montero 4D56",
  description: "Interactive workshop manuals from ACM Motorsport, the Spanish rally team racing a 1989 Pajero towards the Dakar: specs, torques and step-by-step jobs.",
  path: "/en/manuals",
  languages: { "es-ES": "/guias", en: "/en/manuals", "x-default": "/guias" },
  locale: "en_GB",
});

export default function ManualsEn() {
  return (
    <>
      <PageHero title="Workshop manuals." lead="Specs, torque settings and every job step by step, written by a rally team that works on its own 4x4s." crumbs={[{ label: "Manuals", href: "/en/manuals" }]} />
      <section className="bg-midnight pb-24 lg:pb-36">
        <Container>
          <ul className="grid gap-4 md:grid-cols-2">
            <li>
              <Link href="/en/manuals/mitsubishi-pajero-4d56" className="block rounded-[6px] border border-line p-6 no-underline hover:border-racing">
                <span className="t-sub block">Mitsubishi Pajero III / Montero / Shogun 2.5 TD (4D56)</span>
                <span className="mt-2 block opacity-70">2001-2002 · timing belts, head gasket, injection pump, turbo, cooling, brakes…</span>
              </Link>
            </li>
          </ul>
          <p className="t-small mt-10 opacity-60">More manuals in English are on the way. The full site is in Spanish: <Link href="/guias" hrefLang="es" className="text-racing-bright">acmmotorsport.com/guias</Link>.</p>
        </Container>
      </section>
    </>
  );
}
