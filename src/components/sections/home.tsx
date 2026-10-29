import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/media/media-placeholder";
import { RouteMap } from "@/components/media/route-map";
import { GlobeStory } from "@/components/three/globe-story";
import { DunesHero } from "@/components/three/dunes-hero";
import { WordReveal } from "@/components/ui/word-reveal";
import { ProductCard } from "@/components/shop/product-card";
import { Seasons } from "./seasons";
import { ShortCard, VideoCard } from "./video-card";
import type { ChannelVideos, YtVideo } from "@/lib/youtube";
import { youtube } from "@/content/youtube";
import { SponsorsList } from "./sponsors-list";
import { workshopProjects } from "@/content/media";
import { vehicleSpecs } from "@/content/motorsport";
import type { Product } from "@/domain/catalog";
import type { Article } from "@/lib/news";
import { ArticleCard } from "@/components/news/article-card";

const heroVideo = process.env.NEXT_PUBLIC_HERO_VIDEO_URL;
const heroPoster = process.env.NEXT_PUBLIC_HERO_POSTER_URL;

function HeroCopy() {
  return (
    <Container>
      <h1 className="t-hero max-w-[12ch] lg:max-w-[10ch] lg:text-[clamp(2.6rem,5.3vw,6rem)]"><WordReveal text="No es solo motor. Es una forma de vivir." delay={0.15} /></h1>
      <p className="t-lead mt-7 max-w-[36ch] text-paper/75">
        Andrés Cubero Moreno y un Mitsubishi Pajero de 1989, preparado en su propio taller. Tres temporadas para llegar al Dakar, contadas desde dentro.
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
        <ButtonLink href="/motorsport" size="lg">Descubre ACM Motorsport</ButtonLink>
        <ButtonLink href="/tienda" variant="text">Explorar tienda</ButtonLink>
      </div>
    </Container>
  );
}

export function HomeHero() {
  if (heroVideo) {
    return (
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-midnight pb-20">
        <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster={heroPoster || undefined} aria-hidden>
          <source src={heroVideo} />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/30 to-transparent" aria-hidden />
        <div className="relative"><HeroCopy /></div>
      </section>
    );
  }
  return <GlobeStory hero={<HeroCopy />} fallback={<RouteMap align="xMaxYMid" className="h-full w-full" />} />;
}

export function Intro() {
  return (
    <section className="on-paper py-24 lg:py-36" aria-labelledby="intro-title">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <MediaPlaceholder label="Retrato de Andrés junto al Pajero" className="aspect-[4/5] lg:col-span-5" />
        <div className="lg:col-span-6 lg:col-start-7 lg:self-center">
          <h2 id="intro-title" className="t-display max-w-[14ch]">Piloto, mecánico y el que pone la cámara.</h2>
          <div className="mt-8 max-w-[56ch] space-y-4 text-lg leading-relaxed text-slate">
            <p>Andrés compite en regularidad y rally raid con un coche que conoce tornillo a tornillo, porque lo prepara él. Lo que no existe en el mercado lo fabrica en el taller, como el tripmaster con GPS RTK que lleva en el salpicadero.</p>
            <p>Todo queda grabado: lo que sale bien y lo que se rompe a medianoche antes de una verificación.</p>
          </div>
          <dl className="mt-12 grid gap-6 border-t border-line-dark pt-8 sm:grid-cols-3">
            {[
              ["Coche", "Mitsubishi Pajero MK1, 1989"],
              ["Disciplina", "Regularidad y rally raid"],
              ["Base", "Taller propio en España"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="t-small text-slate">{k}</dt>
                <dd className="mt-1 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}

export function TheCar() {
  const shown = vehicleSpecs.filter((s) => s.value).slice(0, 6);
  return (
    <section className="bg-midnight pb-24 lg:pb-36" aria-labelledby="car-title">
      <MediaPlaceholder label="Pajero MK1 en tramo, plano general" className="aspect-[4/3] w-full sm:aspect-[21/9] lg:max-h-[78vh]" />
      <Container className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="car-title" className="t-display">Mitsubishi Pajero, 1989</h2>
          <p className="t-lead mt-6 max-w-[38ch] text-paper/70">Azul medianoche, Starlink en el techo y electrónica de navegación diseñada en el taller.</p>
          <ButtonLink href="/motorsport#vehiculo" variant="text" className="mt-8">Ver la ficha técnica</ButtonLink>
        </div>
        <dl className="grid gap-x-8 sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
          {shown.map((s) => (
            <div key={s.label} className="border-t border-line py-5">
              <dt className="t-small text-steel">{s.label}</dt>
              <dd className="t-sub mt-1">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export function DakarSection({ episodes: all }: { episodes: YtVideo[] }) {
  const episodes = all.slice(0, 2);
  return (
    <section className="bg-midnight-deep pb-24 lg:pb-36" aria-labelledby="dakar-title">
      <DunesHero className="flex min-h-[92svh] items-end">
        <Container className="pb-16 pt-40 lg:pb-24">
          <h2 id="dakar-title" className="t-hero max-w-[10ch]">Objetivo Dakar</h2>
          <p className="t-lead mt-6 max-w-[40ch] text-paper/80">La serie documental del proyecto. Una temporada cada vez, sin atajos y con el coche de siempre.</p>
          <ButtonLink href="/objetivo-dakar" variant="light" className="mt-8">Ver la serie</ButtonLink>
        </Container>
      </DunesHero>
      <Container>
        {heroVideo && <RouteMap className="mt-16 aspect-[16/9] w-full" align="xMidYMid" />}
        <Seasons className="mt-8" />
        {episodes.length > 0 && (
          <div className="mt-20 grid gap-12 md:grid-cols-2 md:gap-8">
            {episodes.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        )}
      </Container>
    </section>
  );
}

export function LatestVideos({ data }: { data: ChannelVideos }) {
  const [featured, ...rest] = data.videos;
  if (!featured) return null;
  return (
    <section className="bg-ink py-24 lg:py-36" aria-labelledby="videos-title">
      <Container>
        <SectionHeading
          id="videos-title"
          title="Lo último del canal"
          lead="Del tramo al taller, cada semana. Los vídeos se reproducen aquí mismo y cuentan en el canal."
          action={
            <div className="flex flex-wrap items-center gap-6">
              <a href={youtube.subscribeUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "md" })}>Suscribirme en YouTube</a>
              <a href={youtube.channelUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "text" })}>Ver el canal</a>
            </div>
          }
        />
        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8"><VideoCard video={featured} featured /></div>
          <div className="grid content-start gap-10 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {rest.slice(0, 2).map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
        {rest.length > 2 && (
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {rest.slice(2, 6).map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        )}
        {data.shorts.length > 0 && (
          <div className="mt-24">
            <h3 className="t-title">Shorts</h3>
            <div className="-mx-5 mt-8 flex snap-x gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0" data-lenis-prevent>
              {data.shorts.slice(0, 10).map((v) => <ShortCard key={v.id} video={v} />)}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

export function ShopSection({ products }: { products: Product[] }) {
  return (
    <section className="on-paper py-24 lg:py-36" aria-labelledby="shop-title">
      <Container>
        <SectionHeading
          id="shop-title"
          title="La tienda del equipo"
          lead="Ropa y accesorios del proyecto. Cada pedido empuja el coche un poco más cerca de la salida."
          action={<ButtonLink href="/tienda" variant="dark">Ver toda la tienda</ButtonLink>}
        />
        <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-6">
          {products.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        <p className="mt-10 t-small text-slate">Tienda en pruebas: productos y precios de ejemplo. No se realizan cobros.</p>
      </Container>
    </section>
  );
}

export function Worlds() {
  const items = [
    {
      href: "/workshop",
      title: "ACM Workshop",
      text: "Mecánica, metal, madera y electrónica. Lo que se rompe se arregla; lo que no existe se fabrica.",
      photo: "Taller con el Pajero, capó abierto",
      extra: `${workshopProjects.filter((p) => p.status === "En curso").length} proyectos en marcha`,
    },
    {
      href: "/sim-racing",
      title: "ACM Sim Racing",
      text: "Cockpit construido en el taller, simuladores y directos. Entrenar cuando no hay tramo.",
      photo: "Cockpit de simulación",
      extra: "Directos y ACM Motor News",
    },
  ];
  return (
    <section className="bg-midnight py-24 lg:py-36" aria-label="Taller y simulación">
      <Container className="grid gap-16 md:grid-cols-2 md:gap-8">
        {items.map((it) => (
          <article key={it.href} className="group relative">
            <Link href={it.href} className="absolute inset-0 z-10" aria-label={it.title} />
            <div className="overflow-hidden">
              <MediaPlaceholder label={it.photo} tone="dust" className="aspect-[4/3] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.02]" />
            </div>
            <h2 className="t-title mt-7">{it.title}</h2>
            <p className="mt-3 max-w-[44ch] text-paper/70">{it.text}</p>
            <p className="mt-4 t-small text-steel">{it.extra}</p>
          </article>
        ))}
      </Container>
    </section>
  );
}

export function PartnersSection() {
  return (
    <section className="on-paper py-24 lg:py-36" aria-labelledby="partners-title">
      <Container>
        <SectionHeading
          id="partners-title"
          title="Las marcas que empujan con nosotros"
          lead="Visibilidad en el coche, en la serie y en cada directo, durante un proyecto de varios años."
          action={<ButtonLink href="/motorsport#patrocinio" variant="dark">Hazte patrocinador</ButtonLink>}
        />
        <SponsorsList className="mt-14" />
      </Container>
    </section>
  );
}

export function NewsSection({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="on-paper py-24 lg:py-36" aria-labelledby="news-title">
      <Container>
        <SectionHeading id="news-title" title="Noticias y guías" lead="Crónicas del proyecto, actualidad del rally raid y lo que aprendemos en el taller." action={<ButtonLink href="/noticias" variant="dark">Todas las noticias</ButtonLink>} />
        <div className="mt-14 grid gap-x-8 gap-y-4 md:grid-cols-3">
          {articles.slice(0, 3).map((a) => <ArticleCard key={a.slug} a={a} className="py-6" />)}
        </div>
      </Container>
    </section>
  );
}
