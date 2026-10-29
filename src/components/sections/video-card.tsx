import type { YtVideo } from "@/lib/youtube";
import { isPlaceholder } from "@/lib/youtube";
import { YouTubePlayer } from "@/components/media/youtube-player";
import { formatViews, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export function VideoMeta({ video, className }: { video: YtVideo; className?: string }) {
  const parts = [formatViews(video.views), timeAgo(video.publishedAt)].filter(Boolean);
  if (!parts.length) return null;
  return <p className={cn("t-small text-steel", className)}>{parts.join(" · ")}</p>;
}

export function VideoCard({ video, featured = false }: { video: YtVideo; featured?: boolean }) {
  const ph = isPlaceholder(video);
  return (
    <article>
      <YouTubePlayer id={video.id} title={video.title} placeholder={ph} size={featured ? "lg" : "md"} />
      <h3 className={cn("mt-5", featured ? "t-title" : "t-sub")}>{video.title}</h3>
      <VideoMeta video={video} className="mt-2" />
      {featured && video.description && <p className="mt-3 line-clamp-3 max-w-[60ch] text-paper/70">{video.description}</p>}
      {!featured && ph && <p className="mt-2 line-clamp-2 max-w-[52ch] text-paper/70">{video.description}</p>}
    </article>
  );
}

export function ShortCard({ video }: { video: YtVideo }) {
  return (
    <article className="w-[46vw] max-w-[220px] shrink-0 snap-start">
      <YouTubePlayer id={video.id} title={video.title} vertical className="rounded-[6px]" />
      <h3 className="mt-3 line-clamp-2 t-small font-medium">{video.title}</h3>
      <VideoMeta video={video} className="mt-1" />
    </article>
  );
}
