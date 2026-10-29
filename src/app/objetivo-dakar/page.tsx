import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { DunesHero } from "@/components/three/dunes-hero";
import { PlayerProvider, PlayButton } from "@/components/series/player-modal";
import { EpisodeBrowser } from "@/components/series/episode-browser";
import { getSeasons } from "@/lib/series";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { site } from "@/content/site";
import { youtube } from "@/content/youtube";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Objetivo Dakar, la serie",
  description: "Objetivo Dakar: la serie documental de Andrés Cubero Moreno. Temporadas y capítulos del camino de un Pajero de 1989 hasta el Rally Dakar 2028.",
  path: "/objetivo-dakar",
  image: "/objetivo-dakar/opengraph-image",
});

export default async function DakarPage() {
  const seasons = await getSeasons();
  const s1 = seasons[0]!;
  const available = s1.episodes.filter((e) => e.status === "disponible");
  const latest = [...available].reverse().find((e) => e.youtubeId && e.number > 0) ?? null;
  const first = available.find((e) => e.youtubeId) ?? null;
  const chapters = available.filter((e) => e.number > 0).length;

  const ld = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: "Objetivo Dakar",
    url: absoluteUrl("/objetivo-dakar"),
    creator: { "@type": "Person", name: site.founder },
    inLanguage: "es",
    containsSeason: seasons.filter((s) => s.status === "emision").map((s) => ({
      "@type": "TVSeason",
      seasonNumber: s.number,
      numberOfEpisodes: s.totalEpisodes,
      episode: s.episodes.filter((e) => e.youtubeId).map((e) => ({ "@type": "TVEpisode", episodeNumber: e.number, name: e.title, url: `https://www.youtube.com/watch?v=${e.youtubeId}` })),
    })),
  };

  const heroContent = (
    <Container className="relative pb-16 pt-40 lg:pb-24">
      <p className="font-medium text-paper/80">Serie documental · ACM Motorsport</p>
      <h1 className="t-hero mt-4 max-w-[11ch]">Objetivo Dakar</h1>
      <p className="mt-6 flex flex-wrap gap-x-4 text-paper/80">
        <span className="font-medium text-paper">Temporada {s1.number}</span>
        <span>{s1.year}</span>
        <span>{chapters} capítulos{available.some((e) => e.number === 0) ? " + piloto" : ""}</span>
      </p>
      <p className="t-lead mt-4 max-w-[46ch] text-paper/80">{latest ? latest.synopsis : s1.synopsis}</p>
      <div className="mt-9 flex flex-wrap items-center gap-3">
        <PlayButton
          id={latest?.youtubeId ?? null}
          title={latest ? `T${latest.season}:E${latest.number} · ${latest.title}` : "Objetivo Dakar"}
          label={latest ? `Reproducir T${latest.season}:E${latest.number}` : "Próximo capítulo en camino"}
          className="inline-flex h-14 items-center gap-3 rounded-[var(--radius-btn)] bg-paper px-7 font-medium text-ink hover:bg-white aria-disabled:opacity-60"
        />
        {first && first !== latest && (
          <PlayButton id={first.youtubeId} title={first.number === 0 ? `Piloto · ${first.title}` : `T1:E${first.number} · ${first.title}`} label={first.number === 0 ? "Empezar desde el piloto" : "Empezar desde el capítulo 1"} className="inline-flex h-14 items-center gap-3 rounded-[var(--radius-btn)] bg-paper/15 px-6 font-medium text-paper backdrop-blur hover:bg-paper/25" />
        )}
        <a href={youtube.subscribeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center px-4 font-medium text-paper/85 underline decoration-paper/40 underline-offset-[0.35em] hover:decoration-paper">Suscribirme</a>
      </div>
    </Container>
  );

  return (
    <PlayerProvider>
      <JsonLd data={ld} />
      <div className="bg-ink">
        {latest?.youtubeId ? (
          <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element -- portada del último capítulo */}
            <img src={`https://i.ytimg.com/vi/${latest.youtubeId}/maxresdefault.jpg`} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#080a0f_0%,rgb(8_10_15/0.75)_35%,transparent_70%)]" aria-hidden />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/40" aria-hidden />
            {heroContent}
          </section>
        ) : (
          <DunesHero className="flex min-h-[88svh] items-end">{heroContent}</DunesHero>
        )}

        <section id="episodios" className="scroll-mt-20 pb-24 pt-10 lg:pb-36" aria-labelledby="episodios-title">
          <Container>
            <EpisodeBrowser seasons={seasons} />
          </Container>
        </section>
      </div>
    </PlayerProvider>
  );
}
