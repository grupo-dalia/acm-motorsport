"use client";

import { useState } from "react";
import { MediaPlaceholder } from "./media-placeholder";
import { cn } from "@/lib/utils";

type Props = { id: string; title: string; vertical?: boolean; className?: string; placeholder?: boolean; size?: "lg" | "md" };

function marketingConsent() {
  try {
    const raw = window.localStorage.getItem("acm.consent.v1");
    return raw ? Boolean(JSON.parse(raw).marketing) : false;
  } catch {
    return false;
  }
}

/**
 * Reproductor de YouTube "ligero": muestra la miniatura y solo carga el reproductor al pulsar.
 * - La reproducción la inicia el usuario, así que cuenta como visualización.
 * - Con cookies de marketing aceptadas usa youtube.com (anuncios personalizados, mejor RPM);
 *   si no, youtube-nocookie.com (anuncios no personalizados, sin cookies hasta reproducir).
 */
export function YouTubePlayer({ id, title, vertical = false, className, placeholder = false, size = "md" }: Props) {
  const [src, setSrc] = useState<string | null>(null);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${id}/${vertical ? "oardefault" : "maxresdefault"}.jpg`);
  const aspect = vertical ? "aspect-[9/16]" : "aspect-video";

  if (placeholder) return <MediaPlaceholder kind="Vídeo" label={title} className={cn(aspect, className)} />;

  if (src)
    return (
      <div className={cn("relative overflow-hidden bg-ink", aspect, className)}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={src}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );

  return (
    <button
      type="button"
      onClick={() => {
        const host = marketingConsent() ? "www.youtube.com" : "www.youtube-nocookie.com";
        setSrc(`https://${host}/embed/${id}?autoplay=1&rel=0&playsinline=1`);
      }}
      className={cn("group relative block w-full overflow-hidden bg-ink", aspect, className)}
      aria-label={`Reproducir en la web: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de YouTube con fallback de resolución */}
      <img
        src={thumb}
        onError={(e) => {
          if (thumb.includes("hqdefault")) e.currentTarget.style.visibility = "hidden";
          else setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        }}
        onLoad={(e) => {
          // maxresdefault inexistente devuelve un gris de 120px: bajamos a hqdefault
          if (e.currentTarget.naturalWidth <= 120) setThumb(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        }}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.03]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" aria-hidden />
      <span className={cn("absolute bottom-4 left-4 flex items-center gap-3 rounded-full bg-paper font-medium text-ink transition-transform duration-300 group-hover:scale-105", size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 t-small")}>
        <svg viewBox="0 0 12 14" className={size === "lg" ? "size-3.5" : "size-3"} aria-hidden><path d="M0 0l12 7-12 7z" fill="currentColor" /></svg>
        Reproducir
      </span>
    </button>
  );
}
