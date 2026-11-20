import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { CopyCode } from "@/components/shop/copy-code";
import { affiliates } from "@/content/affiliates";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Códigos de descuento de ACM Motorsport",
  description: "Todos nuestros códigos de descuento y enlaces de referido en un sitio: Euro4x4parts, Full Carx, Starlink y las marcas que usamos en el Pajero.",
  path: "/descuentos",
});

export default function DescuentosPage() {
  const crumbs = [{ label: "Descuentos", href: "/descuentos" }];
  const list = affiliates.filter((a) => a.url || a.code);
  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <PageHero tone="paper" title="Códigos de descuento." lead="Lo que usamos en el taller y en las carreras, con descuento. Toca el código para copiarlo y el botón para ir directo a la tienda." crumbs={crumbs} />
      <section className="on-paper pb-24 lg:pb-36">
        <Container>
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {list.map((a) => (
              <li key={a.id} className="flex flex-col rounded-[8px] bg-mist p-6">
                <p className="t-title">{a.name}</p>
                <p className="mt-2 flex-1 text-slate">{a.pitch}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {a.code && <CopyCode code={a.code} />}
                  {a.url && (
                    <a href={`/go/${a.id}`} rel="sponsored nofollow" className="inline-flex h-12 items-center rounded-[var(--radius-btn)] bg-racing px-5 font-medium text-paper no-underline hover:bg-racing-dark">
                      {a.cta}
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-12 max-w-[80ch] t-small text-slate">
            Son enlaces de afiliado, referido o códigos de patrocinador: a ti no te cuestan más y a nosotros nos ayudan a llegar al Dakar. Recambios por modelo en <Link href="/tienda/recambios" className="link-u text-ink">la sección de recambios</Link>.
          </p>
        </Container>
      </section>
    </>
  );
}
