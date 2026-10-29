import { sponsors } from "@/content/motorsport";
import { cn } from "@/lib/utils";

const tierLabel = { principal: "Patrocinador principal", oficial: "Patrocinador oficial", colaborador: "Colaborador" } as const;

/** Lista sobria de patrocinadores. Los logos entran cuando estén los archivos originales. */
export function SponsorsList({ className, divider = "border-line-dark" }: { className?: string; divider?: string }) {
  return (
    <ul className={cn("border-t", divider, className)}>
      {sponsors.map((s) => (
        <li key={s.id} className={cn("grid gap-2 border-b py-6 md:grid-cols-12 md:items-baseline", divider)}>
          <p className="t-title md:col-span-6">{s.name}</p>
          <p className="opacity-60 md:col-span-3">{tierLabel[s.tier]}</p>
          <p className="md:col-span-3 md:text-right">{s.code ? <>Código de descuento <strong className="font-semibold tracking-wide">{s.code}</strong></> : <span className="opacity-60">{s.description}</span>}</p>
        </li>
      ))}
    </ul>
  );
}
