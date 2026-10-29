import type { Video } from "@/content/media";
import { YouTubeLite } from "@/components/media/youtube-lite";

const seriesLabel = { "objetivo-dakar": "Objetivo Dakar", workshop: "ACM Workshop", "sim-racing": "ACM Sim Racing", general: "ACM" } as const;

export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="flex flex-col">
      <YouTubeLite id={video.youtubeId} title={video.title} />
      <p className="eyebrow mt-5">
        {seriesLabel[video.series]}
        {video.episode ? ` · Ep. ${String(video.episode).padStart(2, "0")}` : ""}
      </p>
      <h3 className="mt-2 text-xl font-semibold leading-snug">{video.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-paper/60">{video.summary}</p>
    </article>
  );
}
