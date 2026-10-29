import Link from "next/link";
import type { Metadata } from "next";
import { Search, X } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/shop/product-card";
import { Badge } from "@/components/ui/badge";
import { catalog } from "@/integrations/commerce";
import { categories, fulfillmentLabels, queryProducts, type CategorySlug, type FulfillmentType, type ShopQuery } from "@/domain/catalog";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Tienda oficial",
  description: "Camisetas, sudaderas, gorras, pegatinas y accesorios oficiales de ACM Motorsport y Objetivo Dakar.",
  path: "/tienda",
});

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function parseQuery(sp: Record<string, string | string[] | undefined>): ShopQuery {
  const cat = one(sp.categoria);
  const tipo = one(sp.tipo);
  const orden = one(sp.orden);
  return {
    q: one(sp.q)?.slice(0, 80),
    categoria: categories.some((c) => c.slug === cat) ? (cat as CategorySlug) : undefined,
    tipo: tipo && tipo in fulfillmentLabels ? (tipo as FulfillmentType) : undefined,
    orden: (["destacados", "precio-asc", "precio-desc", "nombre"] as const).find((o) => o === orden),
  };
}

function href(base: ShopQuery, patch: Partial<ShopQuery>) {
  const merged = { ...base, ...patch };
  const params = new URLSearchParams();
  Object.entries(merged).forEach(([k, v]) => v && params.set(k, String(v)));
  const s = params.toString();
  return s ? `/tienda?${s}` : "/tienda";
}

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const query = parseQuery(await searchParams);
  const all = await catalog.listProducts();
  const products = queryProducts(all, query);
  const activeFilters = Boolean(query.q || query.categoria || query.tipo);

  return (
    <>
      <PageHero
        eyebrow="Tienda oficial ACM"
        title={<>Viste el <span className="display-italic text-racing">proyecto</span></>}
        lead="Merchandising oficial de ACM Motorsport. Productos propios, fabricados bajo demanda y recomendaciones de afiliación, siempre identificados."
        crumbs={[{ label: "Tienda", href: "/tienda" }]}
        size="sm"
      >
        <p className="mt-6"><Badge tone="amber">Modo demostración · productos y precios ficticios · no se realizan cobros</Badge></p>
      </PageHero>

      <Container className="py-10 lg:py-14">
        <div className="flex flex-col gap-6 border-b border-line pb-8">
          <form action="/tienda" method="get" role="search" className="flex flex-col gap-3 md:flex-row md:items-center">
            {query.categoria && <input type="hidden" name="categoria" value={query.categoria} />}
            {query.tipo && <input type="hidden" name="tipo" value={query.tipo} />}
            <label className="relative flex-1">
              <span className="sr-only">Buscar productos</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-steel" aria-hidden />
              <input name="q" type="search" defaultValue={query.q} placeholder="Buscar: sudadera, dakar, pegatinas…" className="h-12 w-full border border-line-strong bg-surface pl-11 pr-4 placeholder:text-paper/35 focus:border-paper focus:outline-none" />
            </label>
            <label className="flex items-center gap-3">
              <span className="eyebrow shrink-0">Orden</span>
              <select name="orden" defaultValue={query.orden ?? "destacados"} className="h-12 border border-line-strong bg-surface px-3 focus:border-paper focus:outline-none">
                <option value="destacados">Destacados</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre">Nombre</option>
              </select>
            </label>
            <button type="submit" className="h-12 bg-paper px-6 text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink hover:bg-white">Aplicar</button>
          </form>

          <nav aria-label="Categorías" className="-mx-4 overflow-x-auto px-4">
            <ul className="flex w-max gap-2">
              <li><Link href={href(query, { categoria: undefined })} className={chip(!query.categoria)}>Todo</Link></li>
              {categories.map((c) => (
                <li key={c.slug}><Link href={href(query, { categoria: c.slug })} className={chip(query.categoria === c.slug)} aria-current={query.categoria === c.slug ? "true" : undefined}>{c.name}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Tipo de venta" className="-mx-4 overflow-x-auto px-4">
            <ul className="flex w-max gap-2">
              {(Object.keys(fulfillmentLabels) as FulfillmentType[]).map((t) => (
                <li key={t}>
                  <Link href={href(query, { tipo: query.tipo === t ? undefined : t })} className={chip(query.tipo === t, true)} title={fulfillmentLabels[t].long}>
                    {fulfillmentLabels[t].short}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex items-center justify-between py-6">
          <p className="font-mono text-xs text-steel" aria-live="polite">{products.length} {products.length === 1 ? "producto" : "productos"}</p>
          {activeFilters && (
            <Link href="/tienda" className="inline-flex items-center gap-1.5 text-sm text-paper/70 hover:text-paper"><X className="size-4" /> Limpiar filtros</Link>
          )}
        </div>

        {products.length === 0 ? (
          <div className="border border-dashed border-line-strong px-6 py-20 text-center">
            <p className="text-lg">No hay productos que coincidan.</p>
            <p className="mt-2 text-steel">Prueba con otra búsqueda o quita algún filtro.</p>
            <Link href="/tienda" className="mt-6 inline-block underline underline-offset-4">Ver todo el catálogo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
            {products.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 4} />)}
          </div>
        )}

        <dl className="mt-24 grid gap-px border border-line bg-line md:grid-cols-3">
          {(Object.keys(fulfillmentLabels) as FulfillmentType[]).map((t) => (
            <div key={t} className="bg-ink p-6">
              <dt className="font-semibold">{fulfillmentLabels[t].short}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-paper/60">{fulfillmentLabels[t].long}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}

function chip(active: boolean, subtle = false) {
  return cn(
    "inline-flex h-9 items-center border px-4 text-[0.72rem] font-semibold uppercase tracking-[0.1em] transition-colors",
    active ? "border-paper bg-paper text-ink" : subtle ? "border-line text-paper/60 hover:border-paper/50 hover:text-paper" : "border-line-strong text-paper/80 hover:border-paper",
  );
}
