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
      <PageHero eyebrow="Contacto" title="Hablemos" lead="Patrocinio, colaboraciones de contenido, prensa o dudas con un pedido." crumbs={[{ label: "Contacto", href: "/contacto" }]} size="sm" />
      <Container className="grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <aside className="space-y-8 lg:col-span-4">
          <div>
            <p className="eyebrow">Redes</p>
            <ul className="mt-3 space-y-2">
              {site.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="text-paper/80 hover:text-paper">{s.label} · {site.handle}</a></li>)}
            </ul>
          </div>
          <p className="text-sm text-steel">Respondemos normalmente en pocos días laborables.</p>
        </aside>
        <div className="lg:col-span-7 lg:col-start-6"><ContactForm defaultTopic="colaboracion" /></div>
      </Container>
    </>
  );
}
