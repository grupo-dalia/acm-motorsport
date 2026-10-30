"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Logo de patrocinador servido desde la web oficial de la marca.
 * Si no carga (cambian la URL, bloqueos…), se muestra el nombre en tipografía.
 * TODO: alojar copias propias en /public/sponsors cuando tengamos los archivos originales.
 */
export function SponsorLogo({ src, name, className, textClassName }: { src: string; name: string; className?: string; textClassName?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className={textClassName}>{name}</span>;
  // eslint-disable-next-line @next/next/no-img-element -- logo externo de la marca, sin optimizar a propósito
  return <img src={src} alt={name} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} className={cn("block h-full w-auto max-w-full object-contain object-left", className)} />;
}
