import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { YouTubePlayer } from "@/components/media/youtube-player";
import { AffiliateBox } from "@/components/news/affiliate-box";
import { ProductInline } from "@/components/news/product-inline";
import { ArticleCard } from "@/components/news/article-card";
import { coverOf, getArticle, getArticles, newsCategories } from "@/lib/news";
import Image from "next/image";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { site } from "@/content/site";
import { formatDate } from "@/lib/format";
import { ButtonLink } from "@/components/ui/button";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return (await getArticles()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const a = await getArticle((await params).slug);
  if (!a) return {};
  const meta = pageMetadata({ title: a.title, description: a.summary, path: `/noticias/${a.slug}`, image: coverOf(a) ?? undefined });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: a.date.toISOString(), modifiedTime: (a.updated ?? a.date).toISOString(), authors: [site.founder] }, ...(a.draft ? { robots: { index: false } } : {}) };
}

export default async function ArticlePage({ params }: { params: Params }) {
  const a = await getArticle((await params).slug);
  if (!a) notFound();
  const more = (await getArticles()).filter((x) => x.slug !== a.slug).slice(0, 3);

  const ld = {
    "@context": "https://schema.org",
    "@type": a.category === "taller" || a.category === "overland" ? "Article" : "NewsArticle",
    headline: a.title,
    description: a.summary,
    datePublished: a.date.toISOString(),
    dateModified: (a.updated ?? a.date).toISOString(),
    author: { "@type": "Person", name: site.founder, url: absoluteUrl("/motorsport") },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/icon.svg") } },
    mainEntityOfPage: absoluteUrl(`/noticias/${a.slug}`),
    image: [(() => { const c = coverOf(a); return c ? (c.startsWith("/") ? absoluteUrl(c) : c) : absoluteUrl("/opengraph-image"); })()],
  };

  return (
    <div className="on-paper">
      <JsonLd data={ld} />
      <Container className="pb-24 pt-28 lg:pb-36 lg:pt-36">
        <Breadcrumbs items={[{ label: "Noticias", href: "/noticias" }, { label: a.title, href: `/noticias/${a.slug}` }]} />
        <header className="mt-10 max-w-4xl">
          <p className="text-slate">
            <Link href={`/noticias?categoria=${a.category}`} className="hover:underline">{newsCategories[a.category]}</Link> · <time dateTime={a.date.toISOString()}>{formatDate(a.date.toISOString())}</time> · {a.readingMinutes} min
          </p>
          <h1 className="t-display mt-5">{a.title}</h1>
          <p className="t-lead mt-6 text-slate">{a.summary}</p>
          <p className="mt-6 t-small">Por {site.founder}</p>
        </header>

        {a.youtubeId ? (
          <YouTubePlayer id={a.youtubeId} title={a.title} size="lg" className="mt-12 rounded-[6px]" />
        ) : a.image ? (
          <figure className="relative mt-12 aspect-[16/9] overflow-hidden rounded-[6px] bg-mist lg:aspect-[21/9]">
            <Image src={a.image} alt={a.imageAlt ?? ""} fill priority sizes="(min-width: 1400px) 1320px, 100vw" className="object-cover" />
          </figure>
        ) : null}

        <div className="article mt-12 max-w-[68ch] text-lg leading-[1.75] text-ink/85">
          {a.blocks.map((b, i) => {
            if (b.type === "html") return <div key={i} dangerouslySetInnerHTML={{ __html: b.html }} />;
            if (b.type === "affiliate") return <AffiliateBox key={i} id={b.id} />;
            if (b.type === "product") return <ProductInline key={i} slug={b.id} />;
            return <YouTubePlayer key={i} id={b.id} title={a.title} className="my-10 rounded-[6px]" />;
          })}
        </div>

        {a.sources.length > 0 && (
          <section className="mt-14 max-w-[68ch] border-t border-line-dark pt-6" aria-label="Fuentes">
            <h2 className="t-sub">Fuentes</h2>
            <ul className="mt-3 space-y-1.5 text-slate">
              {a.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="link-u">{s.title}</a></li>)}
            </ul>
          </section>
        )}

        <section className="mt-20 max-w-[68ch] rounded-[8px] bg-ink p-8 text-paper">
          <p className="t-title">Sigue el camino al Dakar</p>
          <p className="mt-3 text-paper/70">Cada pedido de la tienda empuja el coche un poco más cerca de la salida.</p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <ButtonLink href="/tienda">Ver la tienda</ButtonLink>
            <ButtonLink href="/objetivo-dakar" variant="text">Ver la serie</ButtonLink>
          </div>
        </section>

        {more.length > 0 && (
          <section className="mt-24" aria-labelledby="more">
            <h2 id="more" className="t-title">Más artículos</h2>
            <div className="mt-6 grid gap-x-8 md:grid-cols-3">{more.map((m) => <ArticleCard key={m.slug} a={m} className="py-6" />)}</div>
          </section>
        )}
      </Container>
    </div>
  );
}
