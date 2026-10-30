import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Marco de imagen. Con `src` muestra la foto real (next/image, AVIF/WebP automático);
 * sin `src`, un fondo decorativo de marca (curvas de nivel), sin textos de "pendiente" a la vista.
 */
export function MediaPlaceholder({
  label,
  className,
  tone = "night",
  kind = "Foto",
  src,
  position = "50% 50%",
  sizes = "100vw",
  priority = false,
}: {
  label: string;
  className?: string;
  tone?: "night" | "dust" | "light";
  kind?: "Foto" | "Vídeo" | "Logo";
  caption?: string;
  src?: string;
  position?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <figure className={cn("reveal-clip relative isolate overflow-hidden bg-midnight", className)}>
        <Image src={src} alt={label} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
      </figure>
    );
  }
  const bg = {
    night: "bg-[radial-gradient(120%_90%_at_30%_20%,#1c3157_0%,#101e36_45%,#0a1424_100%)] text-paper",
    dust: "bg-[radial-gradient(120%_90%_at_70%_15%,#3a3a44_0%,#1b1f2a_50%,#0d1018_100%)] text-paper",
    light: "bg-[linear-gradient(160deg,#eef1f5_0%,#dfe4ec_100%)] text-ink",
  }[tone];
  return (
    <div className={cn("grain reveal-clip relative isolate overflow-hidden", bg, className)} aria-hidden data-pending={`${kind}: ${label}`}>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full opacity-[0.14]">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          {CONTOURS.map((d, i) => <path key={i} d={d} />)}
        </g>
      </svg>
      <span className="absolute bottom-4 left-4 font-[family-name:var(--font-display)] text-[1.05rem] font-[680] tracking-[-0.03em] opacity-35 [font-stretch:125%]">ACM</span>
    </div>
  );
}

/** Curvas de nivel generadas una vez (deterministas): dunas vistas desde arriba. */
const CONTOURS = Array.from({ length: 11 }, (_, i) => {
  const r = 24 + i * 22;
  const pts = Array.from({ length: 72 }, (_, k) => {
    const a = (k / 72) * Math.PI * 2;
    const wob = 1 + 0.12 * Math.sin(a * 3 + i * 0.7) + 0.06 * Math.cos(a * 5 - i);
    return [290 + Math.cos(a) * r * 1.35 * wob, 120 + Math.sin(a) * r * wob] as const;
  });
  return "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L") + " Z";
});
