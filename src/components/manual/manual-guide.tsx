"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Figure, Part, System } from "@/content/manual-pajero-iii";

export type ManualVehicle = { model: string; years: string; basePath: string };

const EXTENSIONS = ["svg", "webp", "jpg", "png"] as const;

/** Hueco de figura: busca la imagen en /public con varias extensiones; si no hay ninguna, enseña el hueco con su referencia. */
function FigureSlot({ figure, index, basePath }: { figure: Figure; index: number; basePath: string }) {
  const [ext, setExt] = useState(0);
  const missing = ext >= EXTENSIONS.length;
  const src = `${basePath}/${figure.file}.${EXTENSIONS[Math.min(ext, EXTENSIONS.length - 1)]}`;

  return (
    <figure className="overflow-hidden rounded-[6px] border border-line bg-midnight-deep">
      {missing ? (
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 border-b border-dashed border-paper/25 p-6 text-center">
          <span className="rounded-full border border-paper/30 px-3 py-1 text-sm font-medium opacity-80">Figura {index + 1} · pendiente</span>
          {figure.ref && <span className="t-small opacity-60">{figure.ref}</span>}
          <code className="t-small break-all opacity-40">public{basePath}/{figure.file}.jpg</code>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- la extensión se resuelve en el cliente
        <img src={src} alt={figure.caption} loading="lazy" onError={() => setExt((e) => e + 1)} className="block w-full bg-paper object-contain" />
      )}
      <figcaption className="p-4 t-small">
        <span className="font-semibold text-racing-bright">Fig. {index + 1}</span> <span className="opacity-80">{figure.caption}</span>
        {!missing && figure.ref && <span className="block opacity-50">{figure.ref}</span>}
      </figcaption>
    </figure>
  );
}

function PartDetail({ part, basePath }: { part: Part; basePath: string }) {
  return (
    <article key={part.id} className="min-w-0">
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
                <dd className="tnum shrink-0 text-right font-[family-name:var(--font-display)] text-xl font-semibold">
                  {s.value}
                  {s.unit && <span className="ml-1 text-base text-racing-bright">{s.unit}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {part.figures && part.figures.length > 0 && (
        <section className="mt-12" aria-label="Figuras">
          <h3 className="t-sub">Figuras</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {part.figures.map((f, i) => <FigureSlot key={f.file} figure={f} index={i} basePath={basePath} />)}
          </div>
        </section>
      )}

      {part.steps && part.steps.length > 0 && (
        <section className="mt-12" aria-label="Paso a paso">
          <h3 className="t-sub">Paso a paso</h3>
          <ol className="mt-4 grid gap-3">
            {part.steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[3.25rem_1fr] gap-4 rounded-[6px] border border-line bg-midnight p-4">
                <span className="tnum font-[family-name:var(--font-display)] text-3xl font-semibold leading-none text-racing-bright">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="mt-1 opacity-80">{s.text}</p>
                  {s.torque && <p className="mt-2 inline-block rounded-full bg-racing px-3 py-0.5 text-sm font-semibold text-paper">{s.torque}</p>}
                </div>
              </li>
            ))}
          </ol>
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

/** Explorador genérico de manual (cualquier coche): eliges sistema y pieza, y se abre su ficha. La pieza abierta va en el #hash. */
export function ManualGuide({ systems: manualSystems, vehicle: manualVehicle }: { systems: System[]; vehicle: ManualVehicle }) {
  const allParts = useMemo(() => manualSystems.flatMap((s) => s.parts.map((p) => ({ system: s, part: p }))), [manualSystems]);
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

  const current = useMemo(() => allParts.find((x) => x.part.id === active) ?? firstPart, [active, allParts, firstPart]);

  const select = (id: string) => {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
    document.getElementById("manual-detalle")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <nav aria-label="Sistemas del vehículo" className="lg:col-span-3">
        <div className="lg:sticky lg:top-28">
          {manualSystems.map((sys) => (
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
                        className={cn(
                          "w-full rounded-[6px] border px-3 py-2 text-left transition-colors",
                          on ? "border-racing bg-racing text-paper" : "border-line hover:border-paper/40 hover:bg-paper/5",
                        )}
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
          {manualVehicle.model} · {manualVehicle.years} · {current.system.title}
        </p>
        <div className="mt-3">
          <PartDetail part={current.part} basePath={manualVehicle.basePath} />
        </div>
      </div>
    </div>
  );
}
