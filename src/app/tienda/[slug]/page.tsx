import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductPurchase } from "@/components/shop/product-purchase";
import { ProductCard } from "@/components/shop/product-card";
import { catalog } from "@/integrations/commerce";
import { categories, relatedProducts } from "@/domain/catalog";
import { JsonLd, pageMetadata, productLd } from "@/lib/seo";
import Link from "next/link";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await catalog.listProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const product = await catalog.getProductBySlug((await params).slug);
  if (!product) return {};
  const meta = pageMetadata({ title: product.name, description: `${product.tagline} ${product.description}`.slice(0, 158), path: `/tienda/${product.slug}` });
  return product.demo ? { ...meta, robots: { index: false, follow: true } } : meta;
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = await catalog.getProductBySlug((await params).slug);
  if (!product) notFound();
  const related = relatedProducts(await catalog.listProducts(), product);
  const category = categories.find((c) => c.slug === product.category);

  return (
    <div className="on-paper">
      <JsonLd data={productLd(product)} />
      <Container className="pb-24 pt-24 lg:pb-36 lg:pt-32">
        <Breadcrumbs items={[{ label: "Tienda", href: "/tienda" }, ...(category ? [{ label: category.name, href: `/tienda?categoria=${category.slug}` }] : []), { label: product.name, href: `/tienda/${product.slug}` }]} />
        <div className="mt-8"><ProductPurchase product={product} /></div>

        {product.fulfillment !== "affiliate" && (
          <dl className="mt-24 grid gap-10 border-t border-line-dark pt-10 md:grid-cols-3">
            {[
              ["Envíos", "España peninsular y Baleares.", "/legal/envios"],
              ["Devoluciones", "14 días, salvo productos personalizados.", "/legal/devoluciones"],
              ["Pago", "Pasarela segura externa. No guardamos datos de tarjeta.", "/legal/condiciones"],
            ].map(([t, d, h]) => (
              <div key={t}>
                <dt className="t-sub">{t}</dt>
                <dd className="mt-2 text-slate">{d} <Link href={h!} className="link-u text-ink">Condiciones</Link></dd>
              </div>
            ))}
          </dl>
        )}

        {related.length > 0 && (
          <section className="mt-28" aria-labelledby="rel-title">
            <h2 id="rel-title" className="t-title">También del equipo</h2>
            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </Container>
    </div>
  );
}
