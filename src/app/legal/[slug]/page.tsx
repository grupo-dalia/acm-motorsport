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
      <PageHero eyebrow="Legal" title={doc.title} crumbs={[{ label: "Legal", href: `/legal/${doc.slug}` }, { label: doc.title, href: `/legal/${doc.slug}` }]} tone="ink" size="sm" />
      <Container className="py-16 lg:py-24">
        <div className="max-w-3xl">
          <p role="note" className="flex gap-3 border border-gold/40 bg-gold/5 p-4 text-sm text-paper/85">
            <AlertTriangle className="size-5 shrink-0 text-gold" aria-hidden />
            Texto provisional pendiente de revisión jurídica. No debe considerarse definitivo ni conforme a la normativa hasta su validación profesional.
          </p>
          <div className="prose-acm mt-10">
            {doc.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
