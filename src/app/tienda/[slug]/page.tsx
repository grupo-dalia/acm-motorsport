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
import { TrackViewContent } from "@/components/analytics/track-view-content";
import { activeZonesSummary, anyActiveDutiesZone } from "@/domain/shipping";
import { DUTIES_NOTICE } from "@/content/shipping";
import { pinnedRecommendations } from "@/content/promo";
import { activeCampaign } from "@/content/pricing";
import { SHIPPING_RULES } from "@/domain/cart";
import { formatPrice } from "@/lib/format";
import { SurveyPrompt } from "@/components/shop/survey-prompt";

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
  const related = relatedProducts(await catalog.listProducts(), product, 4, pinnedRecommendations);
  const category = categories.find((c) => c.slug === product.category);

  return (
    <div className="on-paper">
      <JsonLd data={productLd(product)} />
      {product.fulfillment !== "affiliate" && !product.demo && (
        <TrackViewContent contentIds={product.variants.filter((v) => v.available).map((v) => v.sku || v.id)} valueCents={product.priceCents} />
      )}
      <Container className="pb-24 pt-24 lg:pb-36 lg:pt-32">
        <Breadcrumbs items={[{ label: "Tienda", href: "/tienda" }, ...(category ? [{ label: category.name, href: `/tienda?categoria=${category.slug}` }] : []), { label: product.name, href: `/tienda/${product.slug}` }]} />
        <div className="mt-8"><ProductPurchase product={product} /></div>

        {related.length > 0 && (
          <section className="mt-16 lg:mt-24" aria-labelledby="rel-title">
            <h2 id="rel-title" className="t-title">Te puede gustar</h2>
            <p className="mt-2 text-slate">{activeCampaign() ? `También con el ${activeCampaign()!.label.replace(/^.*?(−\d+ ?%)$/, "$1")}` : "Combínala"} y envío gratis desde {formatPrice(SHIPPING_RULES.freeFromCents)}.</p>
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}

        {product.fulfillment !== "affiliate" && (
          <dl className="mt-24 grid gap-10 border-t border-line-dark pt-10 md:grid-cols-3">
            {[
              ["Envíos", `${activeZonesSummary()}${anyActiveDutiesZone() ? ` Fuera de la UE: ${DUTIES_NOTICE.charAt(0).toLowerCase()}${DUTIES_NOTICE.slice(1)}` : ""}`, "/legal/envios"],
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

      </Container>
      {product.fulfillment !== "affiliate" && !product.demo && <SurveyPrompt productName={product.name} />}
    </div>
  );
}
