import "server-only";
import { seasons, type SeasonConfig } from "@/content/series";
import { getChannelVideos, getSeriesVideos, isPlaceholder, type YtVideo } from "./youtube";

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
const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function assignEpisodes(cfg: SeasonConfig, videos: YtVideo[], keepOrder = false, allVideos: YtVideo[] = videos): Episode[] {
  // Con lista de reproducción, manda el orden de la lista; si no, el orden de publicación.
  const slots = new Map<number, YtVideo>();
  const used = new Set<string>();
  // 1) Capítulos identificados a mano por palabras clave (buscan en todo el canal)
  for (const [n, o] of Object.entries(cfg.episodes)) {
    const num = Number(n);
    if (num > cfg.releasedThrough || o.youtubeId || !o.match?.length) continue;
    const hit = allVideos.find((v) => !isPlaceholder(v) && !used.has(v.id) && o.match!.some((m) => norm(v.title).includes(norm(m))));
    if (hit) { slots.set(num, hit); used.add(hit.id); }
  }
  // 1b) Reservar el piloto si se identifica por palabras clave, para que no ocupe un capítulo
  let pilotVideo: YtVideo | undefined;
  if (cfg.pilot?.match?.length) {
    pilotVideo = [...videos, ...allVideos].find((v) => !isPlaceholder(v) && !used.has(v.id) && cfg.pilot!.match!.some((m) => norm(v.title).includes(norm(m))));
    if (pilotVideo) used.add(pilotVideo.id);
  }
  const real = videos.filter((v) => !isPlaceholder(v) && !used.has(v.id));
  if (!keepOrder) real.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  // 2) Número explícito en el título ("Capítulo 2", "T1E2")
  const rest: YtVideo[] = [];
  for (const v of real) {
    const n = episodeNumber(v.title);
    if (n && n <= cfg.releasedThrough && !slots.has(n)) { slots.set(n, v); used.add(v.id); }
    else rest.push(v);
  }
  // 3) Huecos restantes: el vídeo publicado entre el capítulo anterior y el siguiente ya conocidos.
  //    Así un vídeo previo a la serie (o uno posterior) no se cuela como capítulo.
  const dateOf = (n: number) => slots.get(n)?.publishedAt ?? null;
  for (let n = 1; n <= cfg.releasedThrough; n++) {
    if (slots.has(n)) continue;
    let lo: string | null = null, hi: string | null = null;
    for (let k = n - 1; k >= 1 && !lo; k--) lo = dateOf(k);
    for (let k = n + 1; k <= cfg.releasedThrough && !hi; k++) hi = dateOf(k);
    const pick = rest.find((v) => !used.has(v.id) && (!lo || v.publishedAt > lo) && (!hi || v.publishedAt < hi));
    if (pick) { slots.set(n, pick); used.add(pick.id); }
  }

  const episodes: Episode[] = Array.from({ length: cfg.totalEpisodes }, (_, i) => {
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

  // Capítulo piloto: el indicado por palabras clave o, si no, el vídeo de la lista anterior al capítulo 1
  if (cfg.pilot !== null && cfg.totalEpisodes > 0) {
    const p = cfg.pilot ?? {};
    const first = slots.get(1)?.publishedAt ?? null;
    const byMatch = pilotVideo;
    const byDate = first ? videos.filter((v) => !isPlaceholder(v) && !used.has(v.id) && v.publishedAt < first).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0] : undefined;
    const v = byMatch ?? byDate;
    const id = p.youtubeId ?? v?.id ?? null;
    if (id) {
      episodes.unshift({
        season: cfg.number,
        number: 0,
        title: p.title ?? v?.title ?? "Capítulo piloto",
        synopsis: p.synopsis ?? v?.description?.split("\n")[0]?.slice(0, 220) ?? "Donde empieza todo.",
        youtubeId: id,
        thumbnail: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        publishedAt: v?.publishedAt ?? null,
        views: v?.views ?? null,
        duration: p.duration ?? null,
        status: "disponible",
      });
    }
  }
  return episodes;
}

export async function getSeasons(): Promise<Season[]> {
  const [{ videos, fromPlaylist }, channel] = await Promise.all([getSeriesVideos("objetivo-dakar"), getChannelVideos()]);
  return seasons.map(({ episodes: _o, ...cfg }) => {
    void _o;
    const full = seasons.find((s) => s.number === cfg.number)!;
    return { ...cfg, episodes: cfg.number === 1 ? assignEpisodes(full, videos, fromPlaylist, [...videos, ...channel.videos]) : assignEpisodes(full, []) };
  });
}
