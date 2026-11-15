import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { PartDetail } from "@/components/manual/manual-explorer";
import type { ManualVehicle, Part, System } from "@/content/manual-types";
import type { PartSeo } from "@/content/manual-seo";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { partVehicles, partsFor } from "@/content/recambios";
import { SparePartCard } from "@/components/shop/spare-part-card";

/** Una página por trabajo del manual (/guias/manual-x/<pieza>), para que cada uno salga solo en Google. */
export type ManualDef = { vehicle: ManualVehicle; systems: System[]; seo: Record<string, PartSeo>; label: string };

const find = (m: ManualDef, id: string) => {
  for (const system of m.systems) for (const part of system.parts) if (part.id === id) return { system, part };
  return null;
};

export const partParams = (m: ManualDef) => m.systems.flatMap((s) => s.parts.map((p) => ({ pieza: p.id })));

const seoFor = (m: ManualDef, part: Part): PartSeo =>
  m.seo[part.id] ?? { title: `${part.title} · ${m.vehicle.short}`, description: part.summary };

export function partMetadata(m: ManualDef, id: string): Metadata {
  const hit = find(m, id);
  if (!hit) return {};
  const seo = seoFor(m, hit.part);
  return pageMetadata({ title: seo.title, description: seo.description, path: `${m.vehicle.href}/${id}`, image: `${m.vehicle.href}/opengraph-image` });
}

/** HowTo + TechArticle: el paso a paso completo en datos estructurados. */
function partLd(m: ManualDef, part: Part, seo: PartSeo) {
  const url = absoluteUrl(`${m.vehicle.href}/${part.id}`);
  const howtos = (part.procedures ?? []).map((p) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${p.title} · ${part.title} · ${m.vehicle.short}`,
    description: p.intro ?? part.summary,
    step: p.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: [s.text, s.torque && `Apriete: ${s.torque}.`, s.caution && `Ojo: ${s.caution}`].filter(Boolean).join(" "), url: `${url}#paso-${i + 1}` })),
  }));
  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: seo.title,
    description: seo.description,
    url,
    inLanguage: "es-ES",
    about: { "@type": "Vehicle", name: m.vehicle.model, vehicleEngine: { "@type": "EngineSpecification", name: m.vehicle.engine } },
    author: { "@type": "Organization", name: "ACM Motorsport", url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "ACM Motorsport", url: absoluteUrl("/") },
  };
  return [article, ...howtos];
}

export function ManualPartPage({ manual, id }: { manual: ManualDef; id: string }) {
  const hit = find(manual, id);
  if (!hit) notFound();
  const { part, system } = hit;
  const seo = seoFor(manual, part);
  const crumbs = [
    { label: "Guías", href: "/guias" },
    { label: manual.label, href: manual.vehicle.href },
    { label: part.title, href: `${manual.vehicle.href}/${part.id}` },
  ];
  const others = manual.systems.flatMap((s) => s.parts).filter((p) => p.id !== part.id);

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      {partLd(manual, part, seo).map((d, i) => <JsonLd key={i} data={d} />)}
      <PageHero title={`${seo.title}.`} lead={seo.description} crumbs={crumbs} />
      <section className="bg-midnight pb-24 lg:pb-36">
        <Container>
          <p className="t-small uppercase tracking-[0.14em] opacity-60">
            {manual.vehicle.model} · {manual.vehicle.engine} · {manual.vehicle.years} · {system.title}
          </p>
          <div className="mt-3">
            <PartDetail part={part} basePath={manual.vehicle.basePath} initialMode="lista" />
          </div>
          {(() => {
            const v = partVehicles.find((x) => x.manual === manual.vehicle.href);
            const items = v ? partsFor(v.slug, part.id).slice(0, 10) : [];
            if (!v || !items.length) return null;
            return (
              <section className="mt-16" aria-label="Recambios para este trabajo">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="t-sub">Recambios para este trabajo</h2>
                  <Link href={`/tienda/recambios?coche=${v.slug}`} className="t-small text-racing-bright">Ver todos los recambios del {v.name}</Link>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                  {items.map((p) => <SparePartCard key={p.ref + p.category} part={p} dark />)}
                </div>
                <p className="t-small mt-3 opacity-50">Se compran en Euro4x4parts, patrocinador de ACM Motorsport. Precio orientativo.</p>
              </section>
            );
          })()}
          <nav aria-label="Más trabajos del manual" className="mt-20 border-t border-line pt-10">
            <h2 className="t-sub">Más trabajos del {manual.label.toLowerCase()}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((p) => (
                <li key={p.id}>
                  <Link href={`${manual.vehicle.href}/${p.id}`} className="inline-block rounded-[6px] border border-line px-3 py-2 no-underline hover:border-paper/40 hover:bg-paper/5">
                    {p.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={manual.vehicle.href} className="inline-block rounded-[6px] bg-racing px-3 py-2 text-paper no-underline">
                  Manual completo
                </Link>
              </li>
            </ul>
          </nav>
        </Container>
      </section>
    </>
  );
}

/** Índice de trabajos con enlaces normales, al pie del manual: así Google llega a todas las páginas. */
export function ManualIndex({ manual }: { manual: ManualDef }) {
  return (
    <nav aria-label="Índice del manual" className="mt-20 border-t border-line pt-10">
      <h2 className="t-sub">Todos los trabajos, uno por página</h2>
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {manual.systems.map((s) => (
          <div key={s.id}>
            <p className="t-small font-semibold uppercase tracking-[0.14em] opacity-60">{s.title}</p>
            <ul className="mt-2 grid gap-1">
              {s.parts.map((p) => (
                <li key={p.id}>
                  <Link href={`${manual.vehicle.href}/${p.id}`} className="hover:text-racing-bright">
                    {seoFor(manual, p).title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
}
