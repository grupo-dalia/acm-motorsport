"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { BeltPulley, BeltView } from "@/content/manual-types";
import { cn } from "@/lib/utils";

/**
 * Vista de frente de una correa de distribución, dibujada por ACM.
 * Centros y diámetros medidos sobre la geometría real del motor; la correa se calcula
 * tangente a cada rueda, así que pasa exactamente por donde pasa en el motor.
 */

const INK = "#1b1b1b";
const RED = "#e3141e";
const SHOP = "https://www.euro4x4parts.com/es/buscar?q=";

type Item = Omit<BeltPulley, "x" | "y" | "r" | "kind"> & Partial<Pick<BeltPulley, "x" | "y" | "r" | "kind">>;
/** Ficha de la familia de recambio; si solo hay referencia OE, su buscador sí la entiende. */
const shopUrl = (p: Item) => p.url ?? (p.oe ? SHOP + encodeURIComponent(p.oe) : undefined);

type Pt = [number, number];

/** Recorrido cerrado de la correa: tramos tangentes + arcos sobre cada rueda. */
export function beltPath(ps: BeltPulley[]) {
  const n = ps.length;
  const seg: { a: Pt; b: Pt }[] = [];
  for (let i = 0; i < n; i++) {
    const p = ps[i]!, q = ps[(i + 1) % n]!;
    const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy);
    const t = Math.atan2(dy, dx) - Math.acos(Math.max(-1, Math.min(1, (p.r - q.r) / d)));
    seg.push({ a: [p.x + p.r * Math.cos(t), p.y + p.r * Math.sin(t)], b: [q.x + q.r * Math.cos(t), q.y + q.r * Math.sin(t)] });
  }
  const f = (v: number) => v.toFixed(1);
  let path = `M${f(seg[0]!.a[0])} ${f(seg[0]!.a[1])}`;
  for (let i = 0; i < n; i++) {
    const s = seg[i]!, nx = seg[(i + 1) % n]!, c = ps[(i + 1) % n]!;
    path += ` L${f(s.b[0])} ${f(s.b[1])}`;
    let sw = Math.atan2(nx.a[1] - c.y, nx.a[0] - c.x) - Math.atan2(s.b[1] - c.y, s.b[0] - c.x);
    if (c.r > 0) while (sw < 0) sw += 2 * Math.PI;
    else while (sw > 0) sw -= 2 * Math.PI;
    const R = Math.abs(c.r);
    path += ` A${f(R)} ${f(R)} 0 ${Math.abs(sw) > Math.PI ? 1 : 0} ${c.r > 0 ? 1 : 0} ${f(nx.a[0])} ${f(nx.a[1])}`;
  }
  return path + " Z";
}

/** Silueta de la tapa/frente del motor: envolvente convexa de las ruedas con margen. */
function outline(ps: BeltPulley[], m: number) {
  const pts: Pt[] = [];
  for (const p of ps) for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2, R = Math.abs(p.r) + m;
    pts.push([p.x + Math.cos(a) * R, p.y + Math.sin(a) * R]);
  }
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: Pt, a: Pt, b: Pt) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo: Pt[] = [], up: Pt[] = [];
  for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2]!, lo[lo.length - 1]!, p) <= 0) lo.pop(); lo.push(p); }
  for (const p of [...pts].reverse()) { while (up.length >= 2 && cross(up[up.length - 2]!, up[up.length - 1]!, p) <= 0) up.pop(); up.push(p); }
  const hull = [...lo.slice(0, -1), ...up.slice(0, -1)];
  return "M" + hull.map((p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" L") + " Z";
}

function Wheel({ p, on }: { p: BeltPulley; on: boolean }) {
  const ink = on ? RED : INK;
  const R = Math.abs(p.r);
  if (p.kind === "idler") {
    return (
      <g>
        <circle cx={p.x} cy={p.y} r={R} fill="#fff" stroke={ink} strokeWidth={1.8} />
        <circle cx={p.x} cy={p.y} r={R * 0.82} fill="none" stroke={ink} strokeWidth={0.8} />
        <circle cx={p.x} cy={p.y} r={R * 0.45} fill="none" stroke={ink} strokeWidth={1.2} />
        <circle cx={p.x} cy={p.y} r={R * 0.2} fill="#fff" stroke={ink} strokeWidth={1.4} />
      </g>
    );
  }
  const teeth = p.teeth ?? Math.round(R / 3.2);
  const root = R - Math.max(4, R * 0.06);
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * Math.PI * 2, w = (Math.PI * 2) / teeth;
    for (const [k, rr] of [[0.05, root], [0.2, R], [0.55, R], [0.7, root]] as const) {
      const a = a0 + w * k;
      pts.push(`${(p.x + Math.cos(a) * rr).toFixed(1)},${(p.y + Math.sin(a) * rr).toFixed(1)}`);
    }
  }
  const holes = R > 70 ? 6 : 0;
  return (
    <g>
      <polygon points={pts.join(" ")} fill="#fff" stroke={ink} strokeWidth={1.3} strokeLinejoin="round" />
      <circle cx={p.x} cy={p.y} r={root - 6} fill="none" stroke={ink} strokeWidth={0.9} />
      {Array.from({ length: holes }, (_, i) => {
        const a = (i / holes) * Math.PI * 2 + 0.3;
        return <circle key={i} cx={p.x + Math.cos(a) * R * 0.55} cy={p.y + Math.sin(a) * R * 0.55} r={R * 0.13} fill="none" stroke={ink} strokeWidth={1.1} />;
      })}
      {!holes && (
        <>
          <circle cx={p.x} cy={p.y} r={R * 0.48} fill="none" stroke={ink} strokeWidth={0.8} />
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
            return <path key={i} d={`M${p.x + Math.cos(a - 0.35) * R * 0.52} ${p.y + Math.sin(a - 0.35) * R * 0.52} A${R * 0.52} ${R * 0.52} 0 0 1 ${p.x + Math.cos(a + 0.35) * R * 0.52} ${p.y + Math.sin(a + 0.35) * R * 0.52}`} fill="none" stroke={ink} strokeWidth={5} strokeLinecap="round" opacity={0.18} />;
          })}
        </>
      )}
      <circle cx={p.x} cy={p.y} r={R * 0.27} fill="#fff" stroke={ink} strokeWidth={1.4} />
      <polygon
        points={[0, 1, 2, 3, 4, 5].map((i) => `${(p.x + Math.cos((i * Math.PI) / 3) * R * 0.15).toFixed(1)},${(p.y + Math.sin((i * Math.PI) / 3) * R * 0.15).toFixed(1)}`).join(" ")}
        fill="none"
        stroke={ink}
        strokeWidth={1.2}
      />
    </g>
  );
}

export function BeltDiagram({ view }: { view: BeltView }) {
  const [sel, setSel] = useState<number | null>(null);
  const byN = new Map(view.pulleys.map((p) => [p.n, p]));
  const loop = view.order.map((n) => byN.get(n)!);
  const items: Item[] = [...view.pulleys, view.belt].sort((a, b) => a.n - b.n);
  const current = items.find((p) => p.n === sel);
  const cx = view.pulleys.reduce((s, p) => s + p.x, 0) / view.pulleys.length;
  const cy = view.pulleys.reduce((s, p) => s + p.y, 0) / view.pulleys.length;
  const path = beltPath(loop);
  const beltOn = sel === view.belt.n;
  const toggle = (n: number) => setSel(sel === n ? null : n);

  return (
    <section className="mt-12" aria-label={view.title}>
      <h3 className="t-sub">{view.title}</h3>
      {view.intro && <p className="mt-1 max-w-[65ch] opacity-70">{view.intro}</p>}
      <div className="mt-4 grid gap-5 xl:grid-cols-[1fr_20rem]">
        <div className="relative overflow-hidden rounded-[6px] border-4 border-paper bg-paper">
          <svg viewBox={`0 0 ${view.width} ${view.height}`} className="block w-full" role="img" aria-label={view.title} style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            <rect width={view.width} height={view.height} fill="#fff" />
            <path d={outline(view.pulleys, 42)} fill="#f1f2f5" stroke={INK} strokeWidth={1.2} strokeDasharray="10 5" />
            <g onClick={() => toggle(view.belt.n)} className="cursor-pointer" role="button" aria-label={`${view.belt.n}. ${view.belt.name}`}>
              <path d={path} fill="none" stroke={beltOn ? RED : INK} strokeWidth={16} strokeLinejoin="round" />
              <path d={path} fill="none" stroke="#fff" strokeWidth={12} strokeLinejoin="round" />
              <path d={path} fill="none" stroke={beltOn ? RED : INK} strokeWidth={5} strokeDasharray="3 3" strokeLinejoin="round" opacity={0.5} />
            </g>
            {view.pulleys.map((p) => (
              <g key={p.n} onClick={() => toggle(p.n)} className="cursor-pointer" role="button" aria-label={`${p.n}. ${p.name}`}>
                <Wheel p={p} on={p.n === sel} />
              </g>
            ))}
            {view.pulleys.map((p) => {
              const on = p.n === sel;
              const a = ((p.labelAngle ?? (Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI) * Math.PI) / 180;
              const R = Math.abs(p.r);
              const x1 = p.x + Math.cos(a) * R * 0.6, y1 = p.y + Math.sin(a) * R * 0.6;
              const x2 = p.x + Math.cos(a) * (R + 58), y2 = p.y + Math.sin(a) * (R + 58);
              return (
                <g key={`n${p.n}`} onClick={() => toggle(p.n)} className="cursor-pointer">
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? RED : INK} strokeWidth={on ? 1.6 : 0.9} />
                  <circle cx={x1} cy={y1} r={2.5} fill={on ? RED : INK} />
                  <circle cx={x2 + Math.cos(a) * 15} cy={y2 + Math.sin(a) * 15} r={15} fill={on ? RED : "#fff"} stroke={on ? RED : INK} strokeWidth={1.2} />
                  <text x={x2 + Math.cos(a) * 15} y={y2 + Math.sin(a) * 15 + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill={on ? "#fff" : INK}>
                    {p.n}
                  </text>
                </g>
              );
            })}
            {view.notes?.map((t, i) => (
              <text key={i} x={t.x} y={t.y} fontSize={15} fill={INK} opacity={0.75}>
                {t.text}
              </text>
            ))}
          </svg>
          <p className="t-small absolute bottom-2 right-3 text-midnight-deep/60">Dibujo ACM Motorsport · vista de frente · toca una pieza</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className={cn("rounded-[6px] border p-4 transition-colors", current ? "border-[#f7c600] bg-[#f7c600]/10" : "border-line")}>
            {current ? (
              <>
                <p className="t-small font-semibold uppercase tracking-[0.14em] text-[#f7c600]">Pieza {current.n}</p>
                <p className="t-sub mt-1">{current.name}</p>
                <dl className="mt-3 grid gap-1 text-sm">
                  <div className="flex justify-between gap-3"><dt className="opacity-60">Referencia</dt><dd className="tnum">{current.oe ?? "por confirmar"}</dd></div>
                  {current.torque && <div className="flex justify-between gap-3"><dt className="opacity-60">Apriete</dt><dd className="font-semibold text-racing-bright">{current.torque}</dd></div>}
                </dl>
                {current.note && <p className="t-small mt-2 opacity-75">{current.note}</p>}
                {shopUrl(current) && (
                <a href={shopUrl(current)} rel="sponsored noopener" target="_blank" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-racing px-4 font-medium text-paper no-underline hover:bg-racing-dark">
                  <ShoppingCart aria-hidden className="size-4" /> Ver recambios en Euro4x4parts
                </a>
                )}
              </>
            ) : (
              <p className="opacity-70">Toca una pieza del dibujo o de la lista para ver su referencia, su apriete y dónde comprarla.</p>
            )}
          </div>
          <ol className="rounded-[6px] border border-line">
            {items.map((p) => (
              <li key={p.n}>
                <button type="button" onClick={() => toggle(p.n)} className={cn("flex w-full items-center gap-3 border-b border-line px-3 py-2 text-left text-sm last:border-b-0", p.n === sel ? "bg-paper/10" : "hover:bg-paper/5")}>
                  <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold", p.n === sel ? "bg-[#f7c600] text-midnight-deep" : "bg-racing text-paper")}>{p.n}</span>
                  <span className="flex-1">{p.name}</span>
                </button>
              </li>
            ))}
          </ol>
          <p className="t-small opacity-50">Euro4x4parts es patrocinador de ACM Motorsport.</p>
        </div>
      </div>
    </section>
  );
}
