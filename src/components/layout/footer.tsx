import Link from "next/link";
import { Logo } from "./logo";
import { brands, legalNav, mainNav, site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { CookiePrefsButton } from "@/components/consent/cookie-consent";
import { Stripe } from "@/components/ui/stripe";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-line bg-ink">
      <Container className="py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 max-w-sm text-paper/60">{site.tagline}</p>
            <p className="mt-2 max-w-sm text-sm text-steel">Proyecto de {site.founder}. Rally todoterreno, mecánica, tecnología y creación de contenido desde España.</p>
            <ul className="mt-8 flex flex-wrap gap-2">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center border border-line px-4 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-paper/70 transition hover:border-paper hover:text-paper">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Secciones" className="lg:col-span-2">
            <p className="eyebrow">Secciones</p>
            <ul className="mt-5 space-y-3">
              {mainNav.map((i) => (
                <li key={i.href}><Link href={i.href} className="text-paper/75 hover:text-paper">{i.label}</Link></li>
              ))}
              <li><Link href="/contacto" className="text-paper/75 hover:text-paper">Contacto</Link></li>
            </ul>
          </nav>
          <div className="lg:col-span-2">
            <p className="eyebrow">Marcas</p>
            <ul className="mt-5 space-y-3">
              {brands.map((b) => (
                <li key={b.id}><Link href={b.href} className="text-paper/75 hover:text-paper">{b.name}</Link></li>
              ))}
            </ul>
          </div>
          <nav aria-label="Legal" className="lg:col-span-3">
            <p className="eyebrow">Legal</p>
            <ul className="mt-5 space-y-3">
              {legalNav.map((i) => (
                <li key={i.href}><Link href={i.href} className="text-sm text-paper/60 hover:text-paper">{i.label}</Link></li>
              ))}
              <li><CookiePrefsButton className="text-sm text-paper/60 hover:text-paper" /></li>
            </ul>
          </nav>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col items-start justify-between gap-4 py-6 text-xs text-steel sm:flex-row sm:items-center">
          <p>© {year} {site.name} · {site.legalOwner}</p>
          <div className="flex items-center gap-3"><Stripe className="h-1 w-8" /> Hecho en España</div>
        </Container>
      </div>
    </footer>
  );
}
