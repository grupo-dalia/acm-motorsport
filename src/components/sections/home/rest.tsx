import Link from "next/link";
import { ArrowRight, Gamepad2, Radio, Wrench } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { Contours } from "@/components/media/contours";
import { RoadmapTimeline } from "../roadmap-timeline";
import { VideoCard } from "../video-card";
import { SponsorsGrid } from "../sponsors-grid";
import { ProductCard } from "@/components/shop/product-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { videos, workshopProjects } from "@/content/media";
import type { Product } from "@/domain/catalog";
import { Badge } from "@/components/ui/badge";

export function DakarBand() {
  return (
    <section className="relative isolate overflow-hidden bg-midnight py-24 lg:py-36" aria-labelledby="dakar-title">
      <Contours className="absolute inset-0 -z-10 h-full w-full text-[#7f9cd1]/25" />
      <Container>
        <SectionHeading
          index="02"
          eyebrow="Proyecto deportivo · Serie documental"
          title={<span id="dakar-title">Objetivo <span className="display-italic text-racing">Dakar</span></span>}
          lead="Tres temporadas, un mismo coche y una cámara siempre encendida. La hoja de ruta está escrita; la serie cuenta cómo se recorre."
          action={<ButtonLink href="/objetivo-dakar" variant="light">Ver la serie <ArrowRight /></ButtonLink>}
        />
        <RoadmapTimeline className="mt-16" />
      </Container>
    </section>
  );
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-24 lg:py-36" aria-labelledby="shop-title">
      <Container>
        <SectionHeading
          index="03"
          eyebrow="Tienda oficial"
          title={<span id="shop-title">Equipación de equipo</span>}
          lead="Ropa y accesorios del proyecto. Cada compra empuja el coche un poco más cerca de la salida."
          action={<ButtonLink href="/tienda" variant="outline">Toda la tienda <ArrowRight /></ButtonLink>}
        />
        <p className="mt-6"><Badge tone="amber">Tienda en modo demostración · no se realizan cobros</Badge></p>
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {products.slice(0, 4).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <ProductCard product={p} priority={i < 2} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function LatestVideos() {
  return (
    <section className="border-t border-line py-24 lg:py-36" aria-labelledby="videos-title">
      <Container>
        <SectionHeading index="04" eyebrow="Vídeos" title={<span id="videos-title">Últimos vídeos</span>} action={<ButtonLink href="/objetivo-dakar#episodios" variant="outline">Todos los episodios <ArrowRight /></ButtonLink>} />
        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {videos.slice(0, 3).map((v, i) => (
            <Reveal key={v.id} delay={i * 0.08}>
              <VideoCard video={v} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function WorkshopTeaser() {
  return (
    <section className="bg-surface py-24 lg:py-36" aria-labelledby="workshop-title">
      <Container className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <SectionHeading
            index="05"
            eyebrow="ACM Workshop"
            title={<span id="workshop-title">El taller es la mitad de la carrera</span>}
            lead="Mecánica, soldadura, carpintería y electrónica. Lo que se rompe se arregla; lo que no existe se fabrica."
          />
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {workshopProjects.slice(0, 4).map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-4 py-4">
                <span className="flex items-center gap-3">
                  <Wrench className="size-4 text-steel" aria-hidden />
                  <span className="font-medium">{p.title}</span>
                </span>
                <span className={`font-mono text-[0.62rem] uppercase tracking-[0.16em] ${p.status === "En curso" ? "text-gold" : "text-steel"}`}>{p.status}</span>
              </li>
            ))}
          </ul>
          <ButtonLink href="/workshop" variant="link" className="mt-8">Entrar al taller →</ButtonLink>
        </div>
        <Reveal className="lg:col-span-6 lg:col-start-7">
          <MediaPlaceholder tone="ink" label="Pajero en el taller, capó abierto" caption="Horizontal 3:2 · luz cálida de taller" className="aspect-[3/2] w-full lg:aspect-[4/5]" />
        </Reveal>
      </Container>
    </section>
  );
}

export function SimRacingTeaser() {
  return (
    <section className="py-24 lg:py-32" aria-labelledby="sim-title">
      <Container>
        <div className="relative isolate grid gap-10 overflow-hidden border border-line p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div className="bg-grid absolute inset-0 -z-10 opacity-60" />
          <div>
            <p className="eyebrow flex items-center gap-3"><span className="text-racing">06</span><span className="h-px w-8 bg-line-strong" />ACM Sim Racing</p>
            <h2 id="sim-title" className="display mt-5 text-[length:var(--text-display-md)]">Entrenar cuando no hay tramo</h2>
            <p className="mt-5 max-w-lg text-lg text-paper/70">Cockpit construido en el taller, simuladores y directos. La otra pista del proyecto.</p>
            <ButtonLink href="/sim-racing" variant="outline" className="mt-8">Ir a Sim Racing <ArrowRight /></ButtonLink>
          </div>
          <ul className="grid content-end gap-3 sm:grid-cols-2">
            {[
              { icon: Gamepad2, t: "Cockpit propio", d: "En construcción en ACM Workshop" },
              { icon: Radio, t: "Directos", d: "Sesiones en vivo y ACM Motor News" },
            ].map((x) => (
              <li key={x.t} className="border border-line bg-ink/70 p-5">
                <x.icon className="size-5 text-racing" aria-hidden />
                <p className="mt-4 font-semibold">{x.t}</p>
                <p className="mt-1 text-sm text-steel">{x.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

export function SponsorsBand() {
  return (
    <section className="border-t border-line py-24 lg:py-36" aria-labelledby="sponsors-title">
      <Container>
        <SectionHeading
          index="07"
          eyebrow="Patrocinadores y colaboradores"
          title={<span id="sponsors-title">Quien empuja con nosotros</span>}
          action={<ButtonLink href="/motorsport#patrocinio">Hazte patrocinador <ArrowRight /></ButtonLink>}
        />
        <SponsorsGrid className="mt-14 border border-line" />
        <p className="mt-6 text-sm text-steel">
          ¿Tu marca encaja con el rally raid, el 4x4 o el overland? <Link href="/contacto" className="text-paper underline underline-offset-4">Hablemos</Link>.
        </p>
      </Container>
    </section>
  );
}

export function NewsletterBand() {
  return (
    <section className="relative isolate overflow-hidden bg-racing py-20 lg:py-28" aria-labelledby="nl-title">
      <div className="absolute -right-20 top-1/2 -z-10 -translate-y-1/2 select-none font-[family-name:var(--font-display)] text-[22rem] font-black italic leading-none text-ink/10 [font-stretch:125%]" aria-hidden>
        08
      </div>
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-paper/80">08 · Novedades</p>
          <h2 id="nl-title" className="display mt-5 text-[length:var(--text-display-md)]">Sube al copiloto</h2>
          <p className="mt-4 max-w-md text-lg text-paper/85">Nuevos episodios, resultados y lanzamientos de la tienda. Sin spam, solo kilómetros.</p>
        </div>
        <NewsletterForm className="[&_button]:bg-ink [&_button]:text-paper [&_button:hover]:bg-black [&_input[type=email]]:border-paper/40 [&_input[type=email]]:bg-racing-dark/40" />
      </Container>
    </section>
  );
}
