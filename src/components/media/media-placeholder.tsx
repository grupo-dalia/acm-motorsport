import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Marco de imagen. Con `src` muestra la foto real (next/image, AVIF/WebP automático);
 * sin `src`, un marco pendiente con el mismo aspecto y un pie que dice qué foto va ahí.
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
    <div className={cn("grain reveal-clip relative isolate overflow-hidden", bg, className)}>
      <p className="absolute bottom-4 left-4 right-4 t-small opacity-60">
        {kind} pendiente · {label}
      </p>
    </div>
  );
}
