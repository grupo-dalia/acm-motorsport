import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ManualExplorer } from "@/components/manual/manual-explorer";
import { VehiclePhoto } from "@/components/manual/vehicle-photo";
import { ManualIndex, manualLanguages } from "@/components/manual/manual-part-page";
import { pajeroManualEn } from "@/content/manual-defs";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

const v = pajeroManualEn.vehicle;

export const metadata: Metadata = pageMetadata({
  title: "Mitsubishi Pajero / Montero 2.5 TD (4D56) workshop manual: torques, capacities and how-tos",
  description: "Free workshop data for the Mitsubishi Pajero III / Montero / Shogun (2001-2002) with the 4D56 2.5 TD: head bolt torque and sequence, timing belts, valve clearance, injection pump timing, oils and capacities.",
  path: v.href,
  image: "/guias/manual-pajero-iii/opengraph-image",
  languages: manualLanguages(pajeroManualEn),
  locale: "en_GB",
});

export default function ManualPajeroEnPage() {
  const crumbs = [
    { label: "Manuals", href: "/en/manuals" },
    { label: "Pajero III 4D56", href: v.href },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero title="Pajero III 4D56 workshop manual." lead={`${v.engine} · ${v.chassis} · ${v.years}. Pick a system and a job: specs, torques and step-by-step instructions.`} crumbs={crumbs}>
        <VehiclePhoto vehicle={v} />
      </PageHero>
      <section className="bg-midnight pb-24 lg:pb-36">
        <Container>
          <p className="t-small mb-8 opacity-70" lang="es">
            ¿En español? <Link href="/guias/manual-pajero-iii" hrefLang="es" className="text-racing-bright">Manual de taller Pajero III</Link>
          </p>
          <ManualExplorer systems={pajeroManualEn.systems} vehicle={v} lang="en" />
          <ManualIndex manual={pajeroManualEn} />
          <p className="t-small mt-16 max-w-[80ch] opacity-50">
            Technical data for the Mitsubishi Pajero III (V60/V70), also sold as Montero and Shogun, 2001-2002, written by ACM Motorsport. Mitsubishi and Pajero are trademarks of Mitsubishi Motors Corporation; this guide is not affiliated with them. Always check the data for your version before working on the car. Drawings are labelled in Spanish.
          </p>
        </Container>
      </section>
    </>
  );
}
