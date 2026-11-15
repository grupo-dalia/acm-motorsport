import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { SparePartCard } from "@/components/shop/spare-part-card";
import { partBrands, partCategories, partVehicles, spareParts } from "@/content/recambios";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Recambios 4x4 por marca y modelo",
  description: "Recambios para Mitsubishi Pajero 2.5 TD 4D56 y Lada Niva: distribución, bomba de agua, filtros, frenos, embrague y más, con el catálogo de Euro4x4parts.",
  path: "/tienda/recambios",
});

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function RecambiosPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const marca = partBrands.find((b) => b.slug === one(sp.marca))?.slug;
  const vehicles = partVehicles.filter((v) => !marca || v.brand === marca);
  const coche = vehicles.find((v) => v.slug === one(sp.coche)) ?? vehicles[0]!;
  const parts = spareParts.filter((p) => p.vehicle === coche.slug);
  const href = (q: Record<string, string | undefined>) => {
    const p = new URLSearchParams(Object.entries(q).filter((e): e is [string, string] => Boolean(e[1])));
    const s = p.toString();
    return s ? `/tienda/recambios?${s}` : "/tienda/recambios";
  };

  return (
    <>
      <PageHero
        tone="paper"
        title="Recambios."
        lead="Lo que montamos en el taller, por marca y modelo. Se compra en Euro4x4parts, nuestro patrocinador."
        crumbs={[{ label: "Tienda", href: "/tienda" }, { label: "Recambios", href: "/tienda/recambios" }]}
      />
      <section className="on-paper pb-24 lg:pb-36">
        <Container>
          <nav aria-label="Marcas" className="flex flex-wrap gap-3 border-y border-line-dark py-5">
            <Link href={href({})} className={chip(!marca)}>Todas</Link>
            {partBrands.map((b) => (
              <Link key={b.slug} href={href({ marca: b.slug })} className={chip(marca === b.slug)} aria-current={marca === b.slug ? "true" : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element -- logotipo SVG de marca */}
                <img src={b.logo} alt="" className={cn("h-6 w-auto", b.slug === "lada" && "rounded bg-[#1d3fa6] px-1")} />
                {b.name}
              </Link>
            ))}
          </nav>

          <nav aria-label="Modelos" className="mt-5 flex flex-wrap gap-2">
            {vehicles.map((v) => (
              <Link key={v.slug} href={href({ marca, coche: v.slug })} className={cn("rounded-[6px] border px-4 py-2", v.slug === coche.slug ? "border-ink bg-ink text-paper" : "border-line-dark hover:bg-mist")}>
                <span className="font-medium">{v.name}</span> <span className="opacity-60">{v.engine}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 t-small text-slate">
            <p>{parts.length} recambios para {coche.name} {coche.engine}</p>
            {coche.manual && <Link href={coche.manual} className="link-u text-ink">Abrir su manual de taller</Link>}
            <a href={coche.catalog} rel="sponsored noopener" target="_blank" className="link-u text-ink">Catálogo completo en Euro4x4parts</a>
          </div>

          {partCategories.map((c) => {
            const items = parts.filter((p) => p.category === c.slug);
            if (!items.length) return null;
            return (
              <section key={c.slug} className="mt-14" aria-label={c.name}>
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="t-title">{c.name}</h2>
                  {c.manualPart && coche.manual && (
                    <Link href={`${coche.manual}/${c.manualPart}`} className="t-small link-u">Cómo se cambia</Link>
                  )}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
                  {items.map((p) => <SparePartCard key={p.ref + p.category} part={p} />)}
                </div>
              </section>
            );
          })}

          <p className="mt-20 max-w-[80ch] t-small text-slate">
            Fotos, referencias y precios de Euro4x4parts; pueden cambiar, el precio bueno es el de su web. Euro4x4parts es patrocinador de ACM Motorsport. Mitsubishi, Pajero, Lada y Niva son marcas de sus propietarios: los logotipos solo indican para qué coche es cada recambio, sin relación con los fabricantes.
          </p>
        </Container>
      </section>
    </>
  );
}

function chip(active: boolean) {
  return cn("inline-flex h-11 items-center gap-2 rounded-full px-4 font-medium transition-colors", active ? "bg-ink text-paper" : "bg-mist text-ink hover:bg-ink/10");
}
