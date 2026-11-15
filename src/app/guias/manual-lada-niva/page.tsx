import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ManualExplorer } from "@/components/manual/manual-explorer";
import { nivaSystems, nivaVehicle } from "@/content/manual-lada-niva";
import { VehiclePhoto } from "@/components/manual/vehicle-photo";
import { ManualIndex } from "@/components/manual/manual-part-page";
import { nivaManual } from "@/content/manual-defs";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Manual de taller Lada Niva 2121: culata, pares de apriete y capacidades",
  description: "Datos de taller del Lada Niva 1600 (VAZ-2121): cómo quitar y poner la culata, pares de apriete, reglaje de válvulas, cadena de distribución, aceite y capacidades.",
  path: "/guias/manual-lada-niva",
  image: "/guias/manual-lada-niva/opengraph-image",
});

export default function ManualNivaPage() {
  const crumbs = [
    { label: "Guías", href: "/guias" },
    { label: "Manual Lada Niva", href: "/guias/manual-lada-niva" },
  ];
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero
        title="Manual de taller Lada Niva."
        lead={`${nivaVehicle.engine} · ${nivaVehicle.chassis} · ${nivaVehicle.years}. Elige el sistema y la pieza: datos, aprietes, esquemas y paso a paso.`}
        crumbs={crumbs}
      >
        <VehiclePhoto vehicle={nivaVehicle} />
      </PageHero>
      <section className="bg-midnight pb-24 lg:pb-36">
        <Container>
          <ManualExplorer systems={nivaSystems} vehicle={nivaVehicle} />
          <ManualIndex manual={nivaManual} />
          <p className="t-small mt-16 max-w-[80ch] opacity-50">
            Datos técnicos del Lada Niva 1600 (VAZ-2121, 1977-1994) con motor de carburación, sacados del manual de reparación del VAZ-2121. Textos y esquemas de ACM Motorsport. Lada es una marca de AvtoVAZ; esta guía no está afiliada a ellos. Hay muchos Niva con motor cambiado: comprueba siempre los datos de tu versión antes de trabajar en el coche.
          </p>
        </Container>
      </section>
    </>
  );
}
