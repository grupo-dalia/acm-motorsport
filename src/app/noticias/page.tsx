import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ArticleCard } from "@/components/news/article-card";
import { getArticles, newsCategories } from "@/lib/news";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  ...pageMetadata({ title: "Noticias y guías", description: "Crónicas de Objetivo Dakar, actualidad del rally raid y guías de taller, overland y equipamiento por Andrés Cubero Moreno.", path: "/noticias" }),
  alternates: { canonical: "/noticias", types: { "application/rss+xml": "/noticias/rss.xml" } },
};

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const all = await getArticles();
  const cat = categoria && categoria in newsCategories ? (categoria as keyof typeof newsCategories) : null;
  const list = cat ? all.filter((a) => a.category === cat) : all;
  const [lead, ...rest] = list;

  return (
    <>
      <PageHero tone="paper" title="Noticias y guías" lead="Crónicas del proyecto, actualidad del rally raid y lo que aprendemos en el taller." crumbs={[{ label: "Noticias", href: "/noticias" }]} />
      <section className="on-paper pb-24 lg:pb-36">
        <Container>
          <nav aria-label="Categorías" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
            <ul className="flex w-max gap-1">
              <li><Link href="/noticias" className={chip(!cat)}>Todo</Link></li>
              {Object.entries(newsCategories).map(([k, v]) => (
                <li key={k}><Link href={`/noticias?categoria=${k}`} className={chip(cat === k)}>{v}</Link></li>
              ))}
            </ul>
          </nav>
          {!lead ? (
            <p className="mt-16 t-title">Todavía no hay artículos en esta categoría.</p>
          ) : (
            <>
              <ArticleCard a={lead} large className="mt-12" />
              <div className="mt-10 grid gap-x-8 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((a) => <ArticleCard key={a.slug} a={a} className="py-6" />)}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}

function chip(active: boolean) {
  return cn("inline-flex h-10 items-center rounded-full px-4 font-medium transition-colors", active ? "bg-ink text-paper" : "text-slate hover:bg-mist hover:text-ink");
}
