import "server-only";
import { seasons, type SeasonConfig } from "@/content/series";
import { getSeriesVideos, isPlaceholder, type YtVideo } from "./youtube";

export type Episode = {
  season: number;
  number: number;
  title: string;
  synopsis: string;
  youtubeId: string | null;
  thumbnail: string | null;
  publishedAt: string | null;
  views: number | null;
  duration: string | null;
  status: "disponible" | "proximamente";
};

export type Season = Omit<SeasonConfig, "episodes"> & { episodes: Episode[] };

const NUM = /(?:\bT\s*\d+\s*E\s*|\bep(?:isodio)?\.?\s*|\bcap(?:[ií]tulo)?\.?\s*|#)(\d{1,2})\b/i;

/** Número de capítulo explícito en el título, si lo hay. */
export function episodeNumber(title: string) {
  const m = title.match(NUM);
  return m ? Number(m[1]) : null;
}

/** Asigna vídeos a capítulos: primero los numerados en el título, luego el resto por fecha. */
export function assignEpisodes(cfg: SeasonConfig, videos: YtVideo[], keepOrder = false): Episode[] {
  // Con lista de reproducción, manda el orden de la lista; si no, el orden de publicación.
  const real = videos.filter((v) => !isPlaceholder(v));
  if (!keepOrder) real.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  const slots = new Map<number, YtVideo>();
  const unnumbered: YtVideo[] = [];
  for (const v of real) {
    const n = episodeNumber(v.title);
    if (n && n <= cfg.releasedThrough && !slots.has(n)) slots.set(n, v);
    else unnumbered.push(v);
  }
  for (let n = 1; n <= cfg.releasedThrough && unnumbered.length; n++) if (!slots.has(n)) slots.set(n, unnumbered.shift()!);

  return Array.from({ length: cfg.totalEpisodes }, (_, i) => {
    const n = i + 1;
    const o = cfg.episodes[n] ?? {};
    const upcoming = n > cfg.releasedThrough;
    const v = upcoming ? undefined : slots.get(n);
    const id = o.youtubeId ?? v?.id ?? null;
    return {
      season: cfg.number,
      number: n,
      title: o.title ?? v?.title ?? (upcoming ? `Capítulo ${n}` : `Capítulo ${n}`),
      synopsis: o.synopsis ?? v?.description?.split("\n")[0]?.slice(0, 220) ?? (upcoming ? "En producción." : "Enlace al vídeo pendiente."),
      youtubeId: id,
      thumbnail: id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : null,
      publishedAt: v?.publishedAt ?? null,
      views: v?.views ?? null,
      duration: o.duration ?? null,
      status: upcoming ? "proximamente" : "disponible",
    } satisfies Episode;
  });
}

export async function getSeasons(): Promise<Season[]> {
  const { videos, fromPlaylist } = await getSeriesVideos("objetivo-dakar");
  return seasons.map(({ episodes: _o, ...cfg }) => {
    void _o;
    const full = seasons.find((s) => s.number === cfg.number)!;
    return { ...cfg, episodes: cfg.number === 1 ? assignEpisodes(full, videos, fromPlaylist) : assignEpisodes(full, []) };
  });
}
