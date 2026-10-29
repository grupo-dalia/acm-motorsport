import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ProductCard } from "@/components/shop/product-card";
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
  const params = new URLSearchParams();
  Object.entries({ ...base, ...patch }).forEach(([k, v]) => v && params.set(k, String(v)));
  const s = params.toString();
  return s ? `/tienda?${s}` : "/tienda";
}

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const query = parseQuery(await searchParams);
  const products = queryProducts(await catalog.listProducts(), query);
  const filtered = Boolean(query.q || query.categoria || query.tipo);

  return (
    <>
      <PageHero tone="paper" title="Tienda" lead="Ropa y accesorios del equipo. Cada pedido empuja el coche un poco más cerca de la salida." crumbs={[{ label: "Tienda", href: "/tienda" }]}>
        <p className="mt-8 inline-block rounded-[6px] bg-mist px-4 py-3 t-small">Tienda en pruebas: productos y precios de ejemplo. No se realiza ningún cobro.</p>
      </PageHero>

      <section className="on-paper pb-24 lg:pb-36">
        <Container>
          <div className="flex flex-col gap-4 border-y border-line-dark py-5">
            <nav aria-label="Categorías" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
              <ul className="flex w-max gap-1">
                <li><Link href={href(query, { categoria: undefined })} className={chip(!query.categoria)}>Todo</Link></li>
                {categories.map((c) => (
                  <li key={c.slug}><Link href={href(query, { categoria: c.slug })} className={chip(query.categoria === c.slug)} aria-current={query.categoria === c.slug ? "true" : undefined}>{c.name}</Link></li>
                ))}
              </ul>
            </nav>
            <form action="/tienda" method="get" role="search" className="flex flex-wrap items-center gap-2">
              {query.categoria && <input type="hidden" name="categoria" value={query.categoria} />}
              <label className="flex-1">
                <span className="sr-only">Buscar</span>
                <input name="q" type="search" defaultValue={query.q} placeholder="Buscar" className="h-10 w-full min-w-40 rounded-[var(--radius-btn)] bg-mist px-3 placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-ink/20" />
              </label>
              <label>
                <span className="sr-only">Tipo de venta</span>
                <select name="tipo" defaultValue={query.tipo ?? ""} className="h-10 rounded-[var(--radius-btn)] bg-mist px-3">
                  <option value="">Todos los tipos</option>
                  {(Object.keys(fulfillmentLabels) as FulfillmentType[]).map((t) => <option key={t} value={t}>{fulfillmentLabels[t].short}</option>)}
                </select>
              </label>
              <label>
                <span className="sr-only">Ordenar</span>
                <select name="orden" defaultValue={query.orden ?? "destacados"} className="h-10 rounded-[var(--radius-btn)] bg-mist px-3">
                  <option value="destacados">Destacados</option>
                  <option value="precio-asc">Precio más bajo</option>
                  <option value="precio-desc">Precio más alto</option>
                  <option value="nombre">Nombre</option>
                </select>
              </label>
              <button type="submit" className="h-10 rounded-[var(--radius-btn)] bg-ink px-4 font-medium text-paper">Aplicar</button>
            </form>
          </div>

          <div className="flex items-center justify-between py-6 t-small text-slate">
            <p aria-live="polite">{products.length} {products.length === 1 ? "producto" : "productos"}</p>
            {filtered && <Link href="/tienda" className="link-u text-ink">Quitar filtros</Link>}
          </div>

          {products.length === 0 ? (
            <div className="py-24">
              <p className="t-title">Nada por aquí con esos filtros.</p>
              <p className="mt-3 text-slate">Prueba con otra búsqueda o <Link href="/tienda" className="link-u text-ink">mira todo el catálogo</Link>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:gap-x-6 xl:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} product={p} headingLevel={2} />)}
            </div>
          )}

          <dl className="mt-28 grid gap-10 border-t border-line-dark pt-10 md:grid-cols-3">
            {(Object.keys(fulfillmentLabels) as FulfillmentType[]).map((t) => (
              <div key={t}>
                <dt className="t-sub">{fulfillmentLabels[t].short}</dt>
                <dd className="mt-2 text-slate">{fulfillmentLabels[t].long}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}

function chip(active: boolean) {
  return cn("inline-flex h-10 items-center rounded-full px-4 font-medium transition-colors", active ? "bg-ink text-paper" : "text-slate hover:bg-mist hover:text-ink");
}
