import "server-only";
import { youtube } from "@/content/youtube";
import { videos as fallbackVideos, type Video } from "@/content/media";

/**
 * Vídeos del canal desde los feeds públicos de YouTube (sin clave de API).
 * Truco de listas automáticas del canal: UULF = vídeos largos, UUSH = Shorts.
 * Si el feed no responde, se usan los vídeos de respaldo de content/media.ts.
 */
export type YtVideo = {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  views: number | null;
  thumbnail: string;
  series: Video["series"];
  kind: "video" | "short";
};

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'");

const tag = (xml: string, name: string) => {
  const m = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]!.trim()) : "";
};

const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function classify(title: string, description = ""): Video["series"] {
  const hay = normalize(`${title} ${description}`);
  for (const [series, words] of Object.entries(youtube.seriesKeywords) as [Video["series"], readonly string[]][]) {
    if (words.some((w) => hay.includes(w))) return series;
  }
  return "general";
}

/** Parser del feed Atom de YouTube. Puro y testeado. */
export function parseFeed(xml: string, kind: YtVideo["kind"] = "video"): YtVideo[] {
  const entries = xml.split("<entry>").slice(1).map((e) => e.split("</entry>")[0]!);
  return entries
    .map((e) => {
      const id = tag(e, "yt:videoId");
      const title = tag(e, "title");
      const description = tag(e, "media:description");
      const views = e.match(/<media:statistics views="(\d+)"/);
      return {
        id,
        title,
        description,
        publishedAt: tag(e, "published"),
        views: views ? Number(views[1]) : null,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        series: classify(title, description),
        kind,
      } satisfies YtVideo;
    })
    .filter((v) => /^[\w-]{11}$/.test(v.id));
}

async function fetchFeed(query: string, kind: YtVideo["kind"]) {
  // Solo desarrollo: YOUTUBE_MOCK_FEED=ruta/a/feed.xml para maquetar sin red
  if (process.env.NODE_ENV !== "production" && process.env.YOUTUBE_MOCK_FEED) {
    const { readFile } = await import("node:fs/promises");
    const xml = await readFile(process.env.YOUTUBE_MOCK_FEED, "utf8").catch(() => "");
    return parseFeed(kind === "short" ? xml.replace(/<entry>/g, "<entry>").split("<!--shorts-->")[1] ?? "" : xml.split("<!--shorts-->")[0]!, kind);
  }
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?${query}`, {
      next: { revalidate: youtube.revalidateSeconds, tags: ["youtube"] },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    return parseFeed(await res.text(), kind);
  } catch {
    return null;
  }
}

const uploads = (prefix: "UULF" | "UUSH") => `playlist_id=${prefix}${youtube.channelId.slice(2)}`;

export type ChannelVideos = { videos: YtVideo[]; shorts: YtVideo[]; live: boolean };

/** Vídeos largos y Shorts del canal. `live` indica si vienen del feed real o del respaldo. */
export async function getChannelVideos(): Promise<ChannelVideos> {
  const [long, shorts] = await Promise.all([fetchFeed(uploads("UULF"), "video"), fetchFeed(uploads("UUSH"), "short")]);
  let videos = long;
  if (!videos?.length) videos = await fetchFeed(`channel_id=${youtube.channelId}`, "video");
  if (videos?.length) {
    const shortIds = new Set((shorts ?? []).map((s) => s.id));
    return { videos: videos.filter((v) => !shortIds.has(v.id)), shorts: shorts ?? [], live: true };
  }
  return {
    videos: fallbackVideos.map((v) => ({
      id: v.youtubeId ?? v.id,
      title: v.title,
      description: v.summary,
      publishedAt: v.publishedAt ?? "",
      views: null,
      thumbnail: "",
      series: v.series,
      kind: "video" as const,
    })),
    shorts: [],
    live: false,
  };
}

/** Vídeos de una sección: lista configurada si existe; si no, clasificación por palabras clave. */
export async function getSeriesVideos(series: Exclude<Video["series"], "general">) {
  const playlist = youtube.playlists[series];
  if (playlist) {
    const list = await fetchFeed(`playlist_id=${encodeURIComponent(playlist)}`, "video");
    if (list?.length) return { videos: list.map((v) => ({ ...v, series })), live: true, fromPlaylist: true };
  }
  const all = await getChannelVideos();
  return { videos: all.videos.filter((v) => v.series === series), live: all.live, fromPlaylist: false };
}

export function isPlaceholder(v: YtVideo) {
  return !/^[\w-]{11}$/.test(v.id) || !v.thumbnail;
}
