"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { MediaPlaceholder } from "./media-placeholder";
import { cn } from "@/lib/utils";

/**
 * Embed ligero: no carga el iframe (ni cookies de terceros) hasta que el usuario pulsa.
 * Usa youtube-nocookie. Si no hay ID, muestra placeholder identificado.
 */
export function YouTubeLite({ id, title, className }: { id: string | null; title: string; className?: string }) {
  const [active, setActive] = useState(false);
  if (!id) return <MediaPlaceholder kind="Vídeo" label={title} caption="Enlace de YouTube pendiente" className={cn("aspect-video", className)} />;
  if (active)
    return (
      <div className={cn("relative aspect-video bg-ink", className)}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className={cn("group relative block aspect-video w-full overflow-hidden bg-ink", className)}
      aria-label={`Reproducir: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- miniatura externa, tamaño fijo */}
      <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100" />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-16 place-items-center rounded-full bg-racing text-paper transition group-hover:scale-110">
          <Play className="ml-1 size-6 fill-current" />
        </span>
      </span>
    </button>
  );
}
