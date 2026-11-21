import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { PartDetail } from "@/components/manual/manual-explorer";
import { jobPath, type ManualVehicle, type Part, type System } from "@/content/manual-types";
import type { PartSeo } from "@/content/manual-seo";
import { JsonLd, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { partVehicles, partsFor } from "@/content/recambios";
import { SparePartCard } from "@/components/shop/spare-part-card";
import { PromoBanner } from "@/components/promo/promo-banner";
import { ClubSignup } from "@/components/forms/club-signup";
import { manualUi, type ManualLang } from "@/content/manual-ui";

/** Una página por trabajo del manual (/guias/manual-x/<pieza>), para que cada uno salga solo en Google. */
export type ManualDef = {
  vehicle: ManualVehicle;
  systems: System[];
  seo: Record<string, PartSeo>;
  label: string;
  lang: ManualLang;
  /** El mismo manual en otros idiomas. */
  alt?: Partial<Record<ManualLang, Pick<ManualVehicle, "href" | "slugs">>>;
};

const hreflang: Record<ManualLang, string> = { es: "es-ES", en: "en" };

/** Rutas del mismo trabajo en cada idioma, para el hreflang. */
export function manualLanguages(m: ManualDef, id?: string): Record<string, string> | undefined {
  if (!m.alt) return undefined;
  const at = (v: Pick<ManualVehicle, "href" | "slugs">) => (id ? jobPath(v, id) : v.href);
  const map: Record<string, string> = { [hreflang[m.lang]]: at(m.vehicle) };
  for (const [lang, v] of Object.entries(m.alt)) map[hreflang[lang as ManualLang]] = at(v);
  map["x-default"] = map["es-ES"] ?? at(m.vehicle);
  return map;
}

const find = (m: ManualDef, id: string) => {
  for (const system of m.systems) for (const part of system.parts) if (part.id === id || m.vehicle.slugs?.[part.id] === id) return { system, part };
  return null;
};

export const partParams = (m: ManualDef) => m.systems.flatMap((s) => s.parts.map((p) => ({ pieza: m.vehicle.slugs?.[p.id] ?? p.id })));

const seoFor = (m: ManualDef, part: Part): PartSeo =>
  m.seo[part.id] ?? { title: `${part.title} · ${m.vehicle.short}`, description: part.summary };

export function partMetadata(m: ManualDef, id: string): Metadata {
  const hit = find(m, id);
  if (!hit) return {};
  const seo = seoFor(m, hit.part);
  return pageMetadata({ title: seo.title, description: seo.description, path: jobPath(m.vehicle, hit.part.id), image: `${m.vehicle.href}/opengraph-image`, languages: manualLanguages(m, hit.part.id), locale: m.lang === "en" ? "en_GB" : undefined });
}

/** HowTo + TechArticle: el paso a paso completo en datos estructurados. */
function partLd(m: ManualDef, part: Part, seo: PartSeo) {
  const t = manualUi[m.lang];
  const url = absoluteUrl(jobPath(m.vehicle, part.id));
  const howtos = (part.procedures ?? []).map((p) => ({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${p.title} · ${part.title} · ${m.vehicle.short}`,
    description: p.intro ?? part.summary,
    step: p.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: [s.text, s.torque && `${t.torqueLd}: ${s.torque}.`, s.caution && `${t.cautionLd}: ${s.caution}`].filter(Boolean).join(" "), url: `${url}#${m.lang === "en" ? "step" : "paso"}-${i + 1}` })),
  }));
  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: seo.title,
    description: seo.description,
    url,
    inLanguage: hreflang[m.lang],
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
  const t = manualUi[manual.lang];
  const crumbs = [
    { label: t.guides, href: manual.lang === "en" ? "/en/manuals" : "/guias" },
    { label: manual.label, href: manual.vehicle.href },
    { label: part.title, href: jobPath(manual.vehicle, part.id) },
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
          {manual.alt && Object.entries(manual.alt).map(([lang, v]) => (
            <Link key={lang} href={jobPath(v, part.id)} hrefLang={lang} lang={lang} className="t-small mt-1 inline-block text-racing-bright">
              {lang === "en" ? "Read this job in English" : "Leer este trabajo en español"}
            </Link>
          ))}
          <div className="mt-3">
            <PartDetail part={part} basePath={manual.vehicle.basePath} initialMode="lista" lang={manual.lang} />
          </div>
          {(() => {
            const v = partVehicles.find((x) => x.manual === manual.vehicle.href || x.manual === manual.alt?.es);
            const items = v ? partsFor(v.slug, part.id).slice(0, 10) : [];
            if (!v || !items.length) return null;
            return (
              <section className="mt-16" aria-label={t.parts}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="t-sub">{t.parts}</h2>
                  <Link href={`/tienda/recambios?coche=${v.slug}`} className="t-small text-racing-bright">{t.sparesAll} {v.name}</Link>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                  {items.map((p) => <SparePartCard key={p.ref + p.category} part={p} dark />)}
                </div>
                <p className="t-small mt-3 opacity-50">{t.sparesNote}</p>
              </section>
            );
          })()}
          {manual.lang === "es" && <PromoBanner className="mt-20" />}
          {manual.lang === "es" && <ClubSignup className="mt-6" />}
          <nav aria-label={`${t.more} ${manual.label.toLowerCase()}`} className="mt-20 border-t border-line pt-10">
            <h2 className="t-sub">{t.more} {manual.label.toLowerCase()}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((p) => (
                <li key={p.id}>
                  <Link href={jobPath(manual.vehicle, p.id)} className="inline-block rounded-[6px] border border-line px-3 py-2 no-underline hover:border-paper/40 hover:bg-paper/5">
                    {p.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={manual.vehicle.href} className="inline-block rounded-[6px] bg-racing px-3 py-2 text-paper no-underline">
                  {t.full}
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
  const t = manualUi[manual.lang];
  return (
    <nav aria-label={t.index} className="mt-20 border-t border-line pt-10">
      <h2 className="t-sub">{t.allJobs}</h2>
      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {manual.systems.map((s) => (
          <div key={s.id}>
            <p className="t-small font-semibold uppercase tracking-[0.14em] opacity-60">{s.title}</p>
            <ul className="mt-2 grid gap-1">
              {s.parts.map((p) => (
                <li key={p.id}>
                  <Link href={jobPath(manual.vehicle, p.id)} className="hover:text-racing-bright">
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
