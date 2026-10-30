import { roadmap } from "@/content/motorsport";
import { cn } from "@/lib/utils";

const statusLabel = { hecho: "Hecho", "en-curso": "En curso", planificado: "Planificado", objetivo: "El objetivo" } as const;

/** Las temporadas como filas editoriales (es una secuencia real: el año ordena). */
export function Seasons({ className, divider = "border-line" }: { className?: string; divider?: string }) {
  return (
    <ol className={cn("border-t", divider, className)}>
      {roadmap.map((s) => (
        <li key={s.year} className={cn("grid gap-3 border-b py-8 md:grid-cols-12 md:items-baseline md:gap-6 lg:py-10", divider)}>
          <p className="t-display tnum md:col-span-3">{s.year}</p>
          <div className="md:col-span-6">
            <p className="t-title">{s.events.join(" y ")}</p>
            <p className="mt-2 max-w-[52ch] opacity-70">{s.note}</p>
          </div>
          <p className={cn("md:col-span-3 md:text-right", s.status === "en-curso" ? "text-racing" : "opacity-60")}>
            {s.status === "en-curso" && <span className="mr-2 inline-block size-2 rounded-full bg-racing align-middle" aria-hidden />}
            {statusLabel[s.status]}
          </p>
        </li>
      ))}
    </ol>
  );
}
