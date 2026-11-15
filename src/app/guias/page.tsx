import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { GuideRow } from "@/components/guides/guide-row";
import { getArticles, coverOf } from "@/lib/news";
import { guideCollections } from "@/content/guides";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Guías de rally, 4x4 y taller",
  description: "Aprende regularidad, navegación, mecánica 4x4 y cómo llevar internet por satélite en el coche. Guías paso a paso escritas desde dentro de un Pajero de rally.",
  path: "/guias",
});

export default async function GuidesPage() {
  const guides = (await getArticles()).filter((a) => a.kind === "guide");
  const featured = guides[0];
  const crumbs = [{ label: "Guías", href: "/guias" }];
  const byCollection = guideCollections.map((c) => ({
    collection: c,
    guides: guides.filter((g) => g.collection === c.id).sort((a, b) => a.order - b.order),
  }));

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Guías de ACM Motorsport",
          itemListElement: guides.map((g, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(`/noticias/${g.slug}`), name: g.title })),
        }}
      />
      <section className="relative overflow-hidden bg-midnight">
        {featured && coverOf(featured) && (
          <>
            <Image src={coverOf(featured)!} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/70 to-midnight/30" />
          </>
        )}
        <Container className="relative pb-16 pt-28 lg:pb-24 lg:pt-40">
          <Breadcrumbs items={crumbs} />
          <h1 className="t-hero mt-10 max-w-[14ch]">Aprende a correr.</h1>
          <p className="t-lead mt-6 max-w-[46ch] opacity-80">Guías paso a paso de rally, navegación, mecánica 4x4 e internet en ruta. Lo que aprendemos camino del Dakar, para que tú no tengas que aprenderlo a golpes.</p>
          {featured && (
            <div className="mt-12 max-w-xl border-l-4 border-racing pl-5">
              <p className="t-small uppercase tracking-[0.14em] opacity-70">Última guía</p>
              <Link href={`/noticias/${featured.slug}`} className="mt-2 block t-sub hover:underline hover:decoration-1 hover:underline-offset-4">{featured.title}</Link>
              <p className="mt-2 opacity-70">{featured.summary}</p>
            </div>
          )}
        </Container>
      </section>
      <section className="bg-midnight pb-24 lg:pb-36">
        <Container>
          <Link href="/guias/manual-pajero-iii" className="group mb-16 flex flex-wrap items-center justify-between gap-6 rounded-[6px] border border-line bg-midnight-deep p-6 no-underline transition-colors hover:border-racing lg:p-8">
            <div className="max-w-[60ch]">
              <p className="t-small font-semibold uppercase tracking-[0.14em] text-racing-bright">Nuevo · Manual interactivo</p>
              <p className="t-title mt-2">Manual de taller Pajero III 4D56</p>
              <p className="mt-2 opacity-70">Culata, distribución, válvulas, aceites y capacidades. Eliges la pieza y te sale todo: datos, aprietes y paso a paso.</p>
            </div>
            <span className="inline-flex h-12 items-center rounded-[var(--radius-btn)] bg-racing px-6 font-medium text-paper transition-colors group-hover:bg-racing-dark">Abrir el manual</span>
          </Link>
          <Link href="/guias/manual-lada-niva" className="group mb-16 flex flex-wrap items-center justify-between gap-6 rounded-[6px] border border-line bg-midnight-deep p-6 no-underline transition-colors hover:border-racing lg:p-8">
            <div className="max-w-[60ch]">
              <p className="t-small font-semibold uppercase tracking-[0.14em] text-racing-bright">Nuevo · Manual interactivo</p>
              <p className="t-title mt-2">Manual de taller Lada Niva 2121</p>
              <p className="mt-2 opacity-70">Culata, cadena, reglaje de válvulas, aceites y cotas del Niva 1600. Con esquemas para hacerlo paso a paso.</p>
            </div>
            <span className="inline-flex h-12 items-center rounded-[var(--radius-btn)] bg-racing px-6 font-medium text-paper transition-colors group-hover:bg-racing-dark">Abrir el manual</span>
          </Link>
          {byCollection.map(({ collection, guides }) => <GuideRow key={collection.id} collection={collection} guides={guides} />)}
        </Container>
      </section>
    </>
  );
}
