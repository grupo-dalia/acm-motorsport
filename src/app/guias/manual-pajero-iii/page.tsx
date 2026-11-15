import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ManualExplorer } from "@/components/manual/manual-explorer";
import { manualVehicle } from "@/content/manual-pajero-iii";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Manual de taller Pajero III 4D56: aprietes, capacidades y paso a paso",
  description: "Datos de taller del Mitsubishi Pajero III (2001-2002) con motor 4D56 2.5 TD: orden y par de apriete de culata, correas de distribución, reglaje de válvulas, aceites y capacidades.",
  path: "/guias/manual-pajero-iii",
});

export default function ManualPajeroPage() {
  const crumbs = [
    { label: "Guías", href: "/guias" },
    { label: "Manual Pajero III", href: "/guias/manual-pajero-iii" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero
        title="Manual de taller Pajero III."
        lead={`${manualVehicle.engine} · ${manualVehicle.chassis} · ${manualVehicle.years}. Elige el sistema y la pieza: datos, aprietes y paso a paso.`}
        crumbs={crumbs}
      />
      <section className="bg-midnight pb-24 lg:pb-36">
        <Container>
          <ManualExplorer />
          <p className="t-small mt-16 max-w-[80ch] opacity-50">
            Datos técnicos del Mitsubishi Pajero III (V60/V70) de 2001-2002, redactados por ACM Motorsport. Mitsubishi y Pajero son marcas de Mitsubishi Motors Corporation; esta guía no está afiliada a ellos. Comprueba siempre los datos de tu versión antes de trabajar en el coche.
          </p>
        </Container>
      </section>
    </>
  );
}
