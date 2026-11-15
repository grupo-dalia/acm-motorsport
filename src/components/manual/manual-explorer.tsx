"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ListOrdered, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExplodedDiagram } from "@/components/manual/exploded-view";
import { BeltDiagram } from "@/components/manual/belt-view";
import type { Figure, ManualVehicle, Part, Procedure, System } from "@/content/manual-types";

const EXTENSIONS = ["svg", "webp", "jpg", "png"] as const;

/** Hueco de figura: busca la imagen en /public con varias extensiones; si no hay ninguna, enseña el hueco con su referencia. */
function FigureSlot({ figure, label, basePath }: { figure: Figure; label: string; basePath: string }) {
  const [ext, setExt] = useState(0);
  const missing = ext >= EXTENSIONS.length;
  const src = `${basePath}/${figure.file}.${EXTENSIONS[Math.min(ext, EXTENSIONS.length - 1)]}`;

  return (
    <figure className="overflow-hidden rounded-[6px] border border-line bg-midnight-deep">
      {missing ? (
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 border-b border-dashed border-paper/25 p-6 text-center">
          <span className="rounded-full border border-paper/30 px-3 py-1 text-sm font-medium opacity-80">{label} · pendiente</span>
          {figure.ref && <span className="t-small opacity-60">{figure.ref}</span>}
          <code className="t-small break-all opacity-40">public{basePath}/{figure.file}.jpg</code>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- la extensión se resuelve en el cliente
        <img src={src} alt={figure.caption} loading="lazy" onError={() => setExt((e) => e + 1)} className="block w-full bg-paper object-contain" />
      )}
      <figcaption className="p-4 t-small">
        <span className="font-semibold text-racing-bright">{label}</span> <span className="opacity-80">{figure.caption}</span>
        {!missing && figure.ref && <span className="block opacity-50">{figure.ref}</span>}
      </figcaption>
    </figure>
  );
}

const num = "font-[family-name:var(--font-display)] tnum";

/** Modo taller: un paso cada vez, con su figura, su apriete y lo que hay que tener en cuenta. */
function StepRunner({ procedure, figures, basePath }: { procedure: Procedure; figures: Figure[]; basePath: string }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const total = procedure.steps.length;
  const step = procedure.steps[i]!;
  const fig = step.figure ? figures.find((f) => f.file === step.figure) : undefined;
  const figIndex = fig ? figures.indexOf(fig) : -1;

  const go = useCallback(
    (to: number) => {
      if (to < 0 || to >= total) return;
      setDir(to > i ? 1 : -1);
      setI(to);
    },
    [i, total],
  );

  return (
    <div className="rounded-[6px] border border-racing/60 bg-midnight-deep">
      <div className="flex gap-1 p-4 pb-0" role="tablist" aria-label="Pasos">
        {procedure.steps.map((s, k) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={k === i}
            aria-label={`Paso ${k + 1}: ${s.title}`}
            onClick={() => go(k)}
            className={cn("h-2 flex-1 rounded-full transition-colors", k < i ? "bg-racing" : k === i ? "bg-[#f7c600]" : "bg-paper/15 hover:bg-paper/30")}
          />
        ))}
      </div>
      <div className="relative min-h-[18rem] overflow-hidden p-5 lg:p-8">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={i}
            custom={dir}
            initial={{ opacity: 0, x: dir * 48, skewX: dir * -4 }}
            animate={{ opacity: 1, x: 0, skewX: 0 }}
            exit={{ opacity: 0, x: dir * -48, skewX: dir * 4 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className={cn("grid gap-6", fig && "lg:grid-cols-2")}
          >
            <div>
              <p className="t-small uppercase tracking-[0.14em] opacity-60">
                Paso {i + 1} de {total}
              </p>
              <p className={cn(num, "mt-1 text-6xl font-semibold leading-none text-racing-bright")}>{String(i + 1).padStart(2, "0")}</p>
              <h4 className="t-title mt-3">{step.title}</h4>
              <p className="t-lead mt-3 opacity-85">{step.text}</p>
              {step.torque && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-racing px-4 py-1.5 font-semibold text-paper">
                  <Wrench aria-hidden className="size-4" /> {step.torque}
                </p>
              )}
              {step.caution && (
                <p className="mt-4 border-l-4 border-[#f7c600] bg-[#f7c600]/10 p-3">
                  <span className="font-semibold text-[#f7c600]">Ojo: </span>
                  {step.caution}
                </p>
              )}
            </div>
            {fig && <FigureSlot figure={fig} label={`Fig. ${figIndex + 1}`} basePath={basePath} />}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line p-4">
        <button type="button" onClick={() => go(i - 1)} disabled={i === 0} className="inline-flex h-11 items-center gap-1 rounded-[var(--radius-btn)] border border-line px-4 enabled:hover:border-paper/50 disabled:opacity-30">
          <ChevronLeft aria-hidden className="size-5" /> Anterior
        </button>
        {i < total - 1 ? (
          <button type="button" onClick={() => go(i + 1)} className="inline-flex h-11 items-center gap-1 rounded-[var(--radius-btn)] bg-racing px-5 font-medium text-paper hover:bg-racing-dark">
            Siguiente <ChevronRight aria-hidden className="size-5" />
          </button>
        ) : (
          <button type="button" onClick={() => go(0)} className="inline-flex h-11 items-center rounded-[var(--radius-btn)] bg-[#f7c600] px-5 font-semibold text-midnight-deep">
            ¡Hecho! Volver al inicio
          </button>
        )}
      </div>
    </div>
  );
}

function StepList({ procedure, figures }: { procedure: Procedure; figures: Figure[] }) {
  return (
    <ol className="grid gap-3">
      {procedure.steps.map((s, i) => {
        const figIndex = s.figure ? figures.findIndex((f) => f.file === s.figure) : -1;
        return (
          <li key={s.title} className="grid grid-cols-[3.25rem_1fr] gap-4 rounded-[6px] border border-line bg-midnight p-4">
            <span className={cn(num, "text-3xl font-semibold leading-none text-racing-bright")}>{String(i + 1).padStart(2, "0")}</span>
            <div>
              <p className="font-semibold">{s.title}</p>
              <p className="mt-1 opacity-80">{s.text}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {s.torque && <span className="rounded-full bg-racing px-3 py-0.5 text-sm font-semibold text-paper">{s.torque}</span>}
                {figIndex >= 0 && <span className="rounded-full border border-line px-3 py-0.5 text-sm opacity-70">Ver fig. {figIndex + 1}</span>}
              </div>
              {s.caution && <p className="t-small mt-2 text-[#f7c600]">Ojo: {s.caution}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-4 rounded-[6px] border border-line p-4">
      <p className="t-small font-semibold uppercase tracking-[0.14em] opacity-60">{title}</p>
      <ul className="mt-2 grid gap-1 pl-5 [list-style:square] marker:text-racing-bright">
        {items.map((b) => <li key={b}>{b}</li>)}
      </ul>
    </div>
  );
}

function ProcedureBlock({ procedure, figures, basePath }: { procedure: Procedure; figures: Figure[]; basePath: string }) {
  const [mode, setMode] = useState<"taller" | "lista">("taller");
  const tab = (on: boolean) => cn("inline-flex items-center gap-1.5 rounded-[calc(var(--radius-btn)-2px)] px-3 py-1.5 text-sm", on && "bg-paper text-midnight-deep");
  return (
    <section className="mt-12" aria-label={procedure.title}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="t-sub">{procedure.title}</h3>
          {procedure.intro && <p className="mt-1 max-w-[65ch] opacity-70">{procedure.intro}</p>}
        </div>
        <div className="inline-flex rounded-[var(--radius-btn)] border border-line p-1" role="group" aria-label="Vista">
          <button type="button" onClick={() => setMode("taller")} aria-pressed={mode === "taller"} className={tab(mode === "taller")}>
            <Wrench aria-hidden className="size-4" /> Modo taller
          </button>
          <button type="button" onClick={() => setMode("lista")} aria-pressed={mode === "lista"} className={tab(mode === "lista")}>
            <ListOrdered aria-hidden className="size-4" /> Lista
          </button>
        </div>
      </div>
      {procedure.before && procedure.before.length > 0 && <Checklist title="Antes de empezar" items={procedure.before} />}
      <div className="mt-4">{mode === "taller" ? <StepRunner procedure={procedure} figures={figures} basePath={basePath} /> : <StepList procedure={procedure} figures={figures} />}</div>
      {procedure.after && procedure.after.length > 0 && <Checklist title="Al terminar" items={procedure.after} />}
    </section>
  );
}

function PartDetail({ part, basePath }: { part: Part; basePath: string }) {
  const figures = part.figures ?? [];
  return (
    <article className="min-w-0">
      <h2 className="t-display">{part.title}</h2>
      <p className="t-lead mt-4 max-w-[60ch] opacity-80">{part.summary}</p>

      {part.warning && (
        <div className="mt-8 max-w-[70ch] border-l-4 border-[#f7c600] bg-[#f7c600]/10 p-5">
          <p className="t-small font-semibold uppercase tracking-[0.14em] text-[#f7c600]">Ojo</p>
          <p className="mt-1 opacity-90">{part.warning}</p>
        </div>
      )}

      {part.specs && part.specs.length > 0 && (
        <section className="mt-10" aria-label="Datos">
          <h3 className="t-sub">Datos</h3>
          <dl className="mt-4 grid gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-2">
            {part.specs.map((s) => (
              <div key={s.label} className="flex items-start justify-between gap-4 bg-midnight p-4">
                <dt className="min-w-0">
                  <span className="block">{s.label}</span>
                  {s.note && <span className="t-small block opacity-55">{s.note}</span>}
                </dt>
                <dd className={cn(num, "shrink-0 text-right text-xl font-semibold")}>
                  {s.value}
                  {s.unit && <span className="ml-1 text-base text-racing-bright">{s.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {part.beltViews?.map((v) => <BeltDiagram key={v.title} view={v} />)}
      {part.exploded && <ExplodedDiagram view={part.exploded} />}

      {part.procedures?.map((p) => <ProcedureBlock key={p.title} procedure={p} figures={figures} basePath={basePath} />)}

      {figures.length > 0 && (
        <section className="mt-12" aria-label="Figuras">
          <h3 className="t-sub">Todas las figuras</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {figures.map((f, i) => <FigureSlot key={f.file} figure={f} label={`Fig. ${i + 1}`} basePath={basePath} />)}
          </div>
        </section>
      )}

      {part.tips?.map((t) => (
        <p key={t} className="mt-8 max-w-[70ch] rounded-[6px] bg-racing p-5 text-paper">
          <span className="font-semibold">Consejo ACM: </span>
          {t}
        </p>
      ))}
    </article>
  );
}

/** Explorador de un manual: eliges sistema y pieza, y se abre su ficha. La pieza abierta va en el #hash para poder compartirla. */
export function ManualExplorer({ systems, vehicle }: { systems: System[]; vehicle: ManualVehicle }) {
  const allParts = useMemo(() => systems.flatMap((s) => s.parts.map((p) => ({ system: s, part: p }))), [systems]);
  const firstPart = allParts[0]!;
  const [active, setActive] = useState(firstPart.part.id);

  useEffect(() => {
    const read = () => {
      const id = window.location.hash.slice(1);
      if (allParts.some((x) => x.part.id === id)) setActive(id);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [allParts]);

  const current = allParts.find((x) => x.part.id === active) ?? firstPart;
  const select = (id: string) => {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
    document.getElementById("manual-detalle")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <nav aria-label="Sistemas del vehículo" className="lg:col-span-3">
        <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
          {systems.map((sys) => (
            <div key={sys.id} className="mb-6">
              <p className="t-small font-semibold uppercase tracking-[0.14em] opacity-60">{sys.title}</p>
              <ul className="mt-2 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {sys.parts.map((p) => {
                  const on = p.id === current.part.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => select(p.id)}
                        aria-current={on ? "true" : undefined}
                        className={cn("w-full rounded-[6px] border px-3 py-2 text-left transition-colors", on ? "border-racing bg-racing text-paper" : "border-line hover:border-paper/40 hover:bg-paper/5")}
                      >
                        {p.title}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>
      <div id="manual-detalle" className="scroll-mt-28 lg:col-span-9">
        <p className="t-small uppercase tracking-[0.14em] opacity-60">
          {vehicle.model} · {vehicle.years} · {current.system.title}
        </p>
        <div className="mt-3">
          <PartDetail key={current.part.id} part={current.part} basePath={vehicle.basePath} />
        </div>
      </div>
    </div>
  );
}
