import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { legalDocs } from "@/content/legal";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalDocs.find((d) => d.slug === slug);
  return doc ? { ...pageMetadata({ title: doc.title, description: doc.description, path: `/legal/${doc.slug}` }), robots: { index: false, follow: true } } : {};
}

export default async function LegalPage({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = legalDocs.find((d) => d.slug === slug);
  if (!doc) notFound();
  return (
    <>
      <PageHero tone="paper" title={doc.title} crumbs={[{ label: doc.title, href: `/legal/${doc.slug}` }]} />
      <section className="on-paper pb-24 lg:pb-36"><Container className="border-t border-line-dark pt-12">
        <div className="max-w-3xl">
          <p role="note" className="flex gap-3 rounded-[6px] bg-mist p-4 t-small text-ink">
            <AlertTriangle className="size-5 shrink-0 text-racing" aria-hidden />
            Texto provisional pendiente de revisión jurídica. No debe considerarse definitivo ni conforme a la normativa hasta su validación profesional.
          </p>
          <div className="prose-acm mt-10 text-slate [&_h2]:text-ink">
            {doc.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            ))}
          </div>
        </div>
      </Container></section>
    </>
  );
}
