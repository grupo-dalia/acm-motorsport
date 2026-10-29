import { ArrowRight } from "lucide-react";
import { HeroMedia } from "@/components/media/hero-media";
import { HeroParallax } from "../hero-parallax";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { roadmap } from "@/content/motorsport";
import { Stripe } from "@/components/ui/stripe";

export function HomeHero() {
  return (
    <HeroParallax background={<HeroMedia />} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-[5] bg-gradient-to-t from-ink via-ink/20 to-transparent" aria-hidden />
      <Container className="flex min-h-[100svh] flex-col justify-end pb-10 pt-28 lg:pb-14">
        <div className="max-w-6xl">
          <p className="eyebrow flex items-center gap-3 text-paper/70">
            <Stripe className="h-1 w-8" /> ACM Motorsport · Temporada 2026
          </p>
          <h1 className="display mt-6 text-[length:var(--text-display-xl)]">
            <span className="block">No es solo motor.</span>
            <span className="display-italic block text-racing">Es una forma de vivir.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-paper/75 sm:text-xl">
            Competición, aventura, ingeniería y creación. Un Mitsubishi Pajero de 1989, un taller propio y un objetivo escrito en el calendario: el Dakar.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/motorsport" size="lg">
              Descubre ACM Motorsport <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
            </ButtonLink>
            <ButtonLink href="/tienda" size="lg" variant="outline">
              Explorar tienda
            </ButtonLink>
          </div>
        </div>

        <ol className="mt-14 grid grid-cols-3 border-t border-line-strong" aria-label="Hoja de ruta">
          {roadmap.map((s) => (
            <li key={s.year} className="border-r border-line pr-3 pt-4 last:border-r-0 sm:pr-6">
              <p className="font-mono text-[0.65rem] tracking-[0.18em] text-steel">{s.year}</p>
              <p className={`mt-1 text-sm font-semibold sm:text-base ${s.status === "objetivo" ? "text-racing" : ""}`}>{s.events.join(" · ")}</p>
            </li>
          ))}
        </ol>
      </Container>
    </HeroParallax>
  );
}
