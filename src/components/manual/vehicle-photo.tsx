import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";
import type { ManualVehicle } from "@/content/manual-types";

/** Foto del coche del manual con su crédito. Si el archivo aún no está en /public, no pinta nada. */
export function VehiclePhoto({ vehicle }: { vehicle: ManualVehicle }) {
  const p = vehicle.photo;
  if (!p || !existsSync(join(process.cwd(), "public", vehicle.basePath, p.file))) return null;
  return (
    <figure className="relative mt-12 overflow-hidden rounded-[6px] border-4 border-paper">
      <div className="relative aspect-[21/9] bg-midnight-deep">
        <Image src={`${vehicle.basePath}/${p.file}`} alt={p.alt} fill priority sizes="(min-width: 1440px) 1344px, 100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight/70 via-transparent to-transparent" />
      </div>
      <span aria-hidden className="absolute -left-1 -top-1 size-8 border-l-8 border-t-8 border-racing" />
      <span aria-hidden className="absolute -bottom-1 -right-1 size-8 border-b-8 border-r-8 border-racing" />
      <figcaption className="absolute bottom-3 left-4 right-4 flex flex-wrap items-end justify-between gap-2">
        <span className="rounded-full bg-midnight/85 px-3 py-1 text-sm font-semibold">{vehicle.model} · {vehicle.years}</span>
        <a href={p.source} className="t-small rounded-full bg-midnight/70 px-3 py-1 opacity-80 hover:opacity-100" rel="noopener" target="_blank">
          Foto: {p.author} · {p.license} · Wikimedia Commons
        </a>
      </figcaption>
    </figure>
  );
}
