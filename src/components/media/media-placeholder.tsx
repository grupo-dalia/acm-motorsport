import { cn } from "@/lib/utils";
import { Contours } from "./contours";
import { ImageOff } from "lucide-react";

/**
 * Placeholder editorial para fotos/vídeos aún no disponibles.
 * Siempre visible como placeholder: nunca se hace pasar por una foto real.
 */
export function MediaPlaceholder({
  label,
  caption,
  className,
  tone = "midnight",
  kind = "Foto",
}: {
  label: string;
  caption?: string;
  className?: string;
  tone?: "midnight" | "ink" | "surface";
  kind?: "Foto" | "Vídeo" | "Logo";
}) {
  const bg = { midnight: "bg-midnight", ink: "bg-ink", surface: "bg-surface" }[tone];
  return (
    <figure className={cn("relative isolate overflow-hidden", bg, className)} role="img" aria-label={`${kind} pendiente: ${label}`}>
      <Contours className="absolute inset-0 -z-10 h-full w-full text-paper/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
      {/* marcas de encuadre */}
      {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => (
        <span key={c} aria-hidden className={cn("absolute size-4 border-paper/40", c)} />
      ))}
      <figcaption className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
        <span>
          <span className="flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-paper/50">
            <ImageOff className="size-3" aria-hidden /> {kind} pendiente
          </span>
          <span className="mt-1.5 block text-sm font-medium text-paper/85">{label}</span>
          {caption && <span className="mt-0.5 block text-xs text-paper/50">{caption}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
