import type { Video } from "@/content/media";
import { YouTubeLite } from "@/components/media/youtube-lite";

export function VideoCard({ video }: { video: Video }) {
  return (
    <article>
      <YouTubeLite id={video.youtubeId} title={video.title} />
      <h3 className="t-sub mt-5">{video.episode ? `${video.episode}. ` : ""}{video.title}</h3>
      <p className="mt-2 max-w-[52ch] opacity-70">{video.summary}</p>
    </article>
  );
}
