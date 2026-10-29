import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductPurchase } from "@/components/shop/product-purchase";
import { ProductCard } from "@/components/shop/product-card";
import { catalog } from "@/integrations/commerce";
import { categories, relatedProducts } from "@/domain/catalog";
import { JsonLd, pageMetadata, productLd } from "@/lib/seo";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await catalog.listProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await catalog.getProductBySlug((await params).slug);
  if (!product) return {};
  const meta = pageMetadata({ title: product.name, description: `${product.tagline} ${product.description}`.slice(0, 158), path: `/tienda/${product.slug}` });
  // Los productos demo no deben indexarse
  return product.demo ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await catalog.getProductBySlug((await params).slug);
  if (!product) notFound();
  const all = await catalog.listProducts();
  const related = relatedProducts(all, product);
  const category = categories.find((c) => c.slug === product.category);

  return (
    <>
      <JsonLd data={productLd(product)} />
      <Container className="pb-24 pt-24 lg:pt-32">
        <Breadcrumbs items={[{ label: "Tienda", href: "/tienda" }, ...(category ? [{ label: category.name, href: `/tienda?categoria=${category.slug}` }] : []), { label: product.name, href: `/tienda/${product.slug}` }]} />
        <div className="mt-8">
          <ProductPurchase product={product} />
        </div>

        {product.fulfillment !== "affiliate" && (
          <ul className="mt-20 grid gap-px border border-line bg-line md:grid-cols-3">
            {[
              { icon: Truck, t: "Envíos a España", d: "Plazos y tarifas en la política de envíos.", href: "/legal/envios" },
              { icon: RotateCcw, t: "Devoluciones", d: "Condiciones según tipo de producto.", href: "/legal/devoluciones" },
              { icon: ShieldCheck, t: "Pago seguro", d: "Procesado por pasarela externa. No guardamos datos de tarjeta.", href: "/legal/condiciones" },
            ].map((x) => (
              <li key={x.t} className="bg-ink p-6">
                <x.icon className="size-5 text-racing" aria-hidden />
                <p className="mt-3 font-semibold">{x.t}</p>
                <p className="mt-1 text-sm text-paper/60">{x.d} <Link href={x.href} className="underline underline-offset-4">Más info</Link></p>
              </li>
            ))}
          </ul>
        )}

        {related.length > 0 && (
          <section className="mt-24" aria-labelledby="rel-title">
            <h2 id="rel-title" className="display text-[length:var(--text-display-sm)]">También te puede interesar</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
