import { cn } from "@/lib/utils";

/**
 * Marco de imagen pendiente. Pensado para recibir la foto real sin cambiar el layout:
 * aspecto fijo, sin iconos ni marcas de "plantilla". El pie indica qué foto va aquí.
 */
export function MediaPlaceholder({ label, className, tone = "night", kind = "Foto" }: { label: string; className?: string; tone?: "night" | "dust" | "light"; kind?: "Foto" | "Vídeo" | "Logo"; caption?: string }) {
  const bg = {
    night: "bg-[radial-gradient(120%_90%_at_30%_20%,#1c3157_0%,#101e36_45%,#0a1424_100%)] text-paper",
    dust: "bg-[radial-gradient(120%_90%_at_70%_15%,#3a3a44_0%,#1b1f2a_50%,#0d1018_100%)] text-paper",
    light: "bg-[linear-gradient(160deg,#eef1f5_0%,#dfe4ec_100%)] text-ink",
  }[tone];
  return (
    <figure className={cn("grain reveal-clip relative isolate overflow-hidden", bg, className)} role="img" aria-label={`${kind} pendiente: ${label}`}>
      <figcaption className="absolute bottom-4 left-4 right-4 t-small opacity-60">
        {kind} pendiente · {label}
      </figcaption>
    </figure>
  );
}
