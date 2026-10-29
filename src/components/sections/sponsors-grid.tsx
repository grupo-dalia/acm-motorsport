import { sponsors } from "@/content/motorsport";
import { cn } from "@/lib/utils";

const tierLabel = { principal: "Patrocinador principal", oficial: "Patrocinador oficial", colaborador: "Colaborador" } as const;

/** Sin logotipos hasta recibir los archivos originales de cada marca. */
export function SponsorsGrid({ className, showDescription = false }: { className?: string; showDescription?: boolean }) {
  return (
    <ul className={cn("grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3", className)}>
      {sponsors.map((s) => (
        <li key={s.id} className="flex min-h-44 flex-col justify-between bg-ink p-7">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-steel">{tierLabel[s.tier]}</p>
          <div>
            <p className="display mt-6 text-2xl">{s.name}</p>
            {showDescription && <p className="mt-2 text-sm text-paper/60">{s.description}</p>}
            {s.code && (
              <p className="mt-3 inline-flex items-center gap-2 border border-dashed border-gold/50 px-3 py-1 font-mono text-xs text-gold">
                Código <strong className="tracking-[0.2em]">{s.code}</strong>
              </p>
            )}
          </div>
          <p className="mt-6 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-paper/30">Logo pendiente</p>
        </li>
      ))}
    </ul>
  );
}
