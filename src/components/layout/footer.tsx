import Link from "next/link";
import { Logo } from "./logo";
import { legalNav, mainNav, site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { CookiePrefsButton } from "@/components/consent/cookie-consent";
import { NewsletterForm } from "@/components/forms/newsletter-form";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <Container className="grid gap-16 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-6">
          <h2 className="t-title max-w-[18ch]">Sigue el camino a Dakar desde dentro.</h2>
          <p className="mt-4 max-w-md text-steel">Nuevos episodios, crónicas de carrera y lanzamientos de la tienda. Un correo cuando hay algo que contar.</p>
          <NewsletterForm className="mt-8 max-w-lg" />
        </div>
        <nav aria-label="Secciones" className="lg:col-span-2 lg:col-start-8">
          <ul className="space-y-3">
            {mainNav.map((i) => <li key={i.href}><Link href={i.href} className="hover:underline">{i.label}</Link></li>)}
            <li><Link href="/contacto" className="hover:underline">Contacto</Link></li>
          </ul>
        </nav>
        <div className="lg:col-span-2">
          <ul className="space-y-3">
            {site.social.map((s) => <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:underline">{s.label}</a></li>)}
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-6 py-8 lg:flex-row lg:items-center lg:justify-between">
          <Logo />
          <ul className="flex flex-wrap gap-x-5 gap-y-2 t-small text-steel">
            {legalNav.map((i) => <li key={i.href}><Link href={i.href} className="hover:text-paper">{i.label}</Link></li>)}
            <li><CookiePrefsButton className="hover:text-paper" /></li>
          </ul>
          <p className="t-small text-steel">© {year} {site.legalOwner}</p>
        </Container>
      </div>
    </footer>
  );
}
