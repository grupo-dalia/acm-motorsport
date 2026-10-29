import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "Contacto", description: "Contacto para patrocinio, colaboraciones, prensa y tienda de ACM Motorsport.", path: "/contacto" });

export default function ContactPage() {
  return (
    <>
      <PageHero tone="paper" title="Hablemos." lead="Patrocinio, colaboraciones de contenido, prensa o dudas con un pedido." crumbs={[{ label: "Contacto", href: "/contacto" }]} />
      <section className="on-paper pb-24 lg:pb-36">
        <Container className="grid gap-14 border-t border-line-dark pt-14 lg:grid-cols-12">
          <aside className="space-y-3 lg:col-span-4">
            <p className="text-slate">También en redes como {site.handle}</p>
            <ul className="space-y-2">
              {site.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="link-u">{s.label}</a></li>)}
            </ul>
          </aside>
          <div className="lg:col-span-7 lg:col-start-6"><ContactForm defaultTopic="colaboracion" /></div>
        </Container>
      </section>
    </>
  );
}
