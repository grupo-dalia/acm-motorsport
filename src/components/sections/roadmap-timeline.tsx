import { roadmap } from "@/content/motorsport";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const statusLabel = { "en-curso": "En curso", planificado: "Planificado", objetivo: "Objetivo" } as const;

export function RoadmapTimeline({ className }: { className?: string }) {
  return (
    <ol className={cn("relative grid gap-px bg-line-strong md:grid-cols-3", className)}>
      {roadmap.map((stage, i) => (
        <li key={stage.year} className={cn("relative bg-midnight", stage.status === "objetivo" && "bg-[linear-gradient(160deg,#101e36_0%,#2a0d14_100%)]")}>
          <Reveal delay={i * 0.1} className="flex h-full flex-col p-7 lg:p-10">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs tracking-[0.2em] text-paper/60">ETAPA {String(i + 1).padStart(2, "0")}</span>
              <span className={cn("font-mono text-[0.62rem] uppercase tracking-[0.18em]", stage.status === "en-curso" ? "text-gold" : stage.status === "objetivo" ? "text-racing" : "text-steel")}>
                {stage.status === "en-curso" && <span className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-gold align-middle" />}
                {statusLabel[stage.status]}
              </span>
            </div>
            <p className="display mt-10 text-[length:var(--text-display-lg)] leading-none text-paper/95">{stage.year}</p>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-steel">{stage.title}</p>
            <ul className="mt-8 space-y-1">
              {stage.events.map((e) => (
                <li key={e} className="text-xl font-semibold">{e}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-paper/60">{stage.note}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
