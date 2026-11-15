"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExplodedPart, ExplodedView, PartShape } from "@/content/manual-types";

const SHOP = "https://www.euro4x4parts.com/es/buscar?q=";
const INK = "#1b1b1b";
const RED = "#e3141e";
/** Proyección isométrica: la cara frontal de la pieza mira hacia delante-izquierda, como en un despiece de taller. */
const ISO = "matrix(0.866 0.5 0 1 0 0)";

function Face({ shape, stroke, sw }: { shape: PartShape; stroke: string; sw: number }) {
  const fill = "#fff";
  switch (shape.kind) {
    case "sprocket": {
      const { r, teeth } = shape;
      const pts: string[] = [];
      for (let i = 0; i < teeth * 4; i++) {
        const a = (Math.PI * 2 * i) / (teeth * 4);
        const rr = i % 4 === 0 || i % 4 === 1 ? r : r * 0.9;
        pts.push(`${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`);
      }
      return (
        <g>
          <polygon points={pts.join(" ")} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <circle r={r * 0.62} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
          <circle r={r * 0.3} fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x={-r * 0.05} y={-r * 0.38} width={r * 0.1} height={r * 0.1} fill={stroke} />
        </g>
      );
    }
    case "pulley":
      return (
        <g>
          <circle r={shape.r} fill={fill} stroke={stroke} strokeWidth={sw} />
          {Array.from({ length: shape.grooves ?? 3 }, (_, i) => (
            <circle key={i} r={shape.r * (0.86 - i * 0.07)} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
          ))}
          <circle r={shape.r * 0.42} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
          <circle r={shape.r * 0.2} fill={fill} stroke={stroke} strokeWidth={sw} />
        </g>
      );
    case "belt": {
      const { w, h } = shape;
      return (
        <g>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill="none" stroke={stroke} strokeWidth={sw} />
          <rect x={-w / 2 + 7} y={-h / 2 + 7} width={w - 14} height={h - 14} rx={(h - 14) / 2} fill="none" stroke={stroke} strokeWidth={sw * 0.8} />
          {shape.teeth === false ? (
            <rect x={-w / 2 + 3.5} y={-h / 2 + 3.5} width={w - 7} height={h - 7} rx={(h - 7) / 2} fill="none" stroke={stroke} strokeWidth={sw * 0.4} />
          ) : (
            <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={(h - 20) / 2} fill="none" stroke={stroke} strokeWidth={6} strokeDasharray="3 3" />
          )}
        </g>
      );
    }
    case "cover":
      return <path d={`M${-shape.w / 2} ${-shape.h / 2} h${shape.w * 0.7} q${shape.w * 0.3} 0 ${shape.w * 0.3} ${shape.h * 0.3} v${shape.h * 0.7} h${-shape.w} z`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case "tensioner":
      return (
        <g>
          <path d={`M${-shape.r * 1.7} ${shape.r * 0.5} L${shape.r * 0.1} ${-shape.r * 0.4} L${shape.r * 1.0} ${shape.r * 1.4} L${-shape.r * 1.3} ${shape.r * 1.7} z`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <circle cx={-shape.r * 1.3} cy={shape.r * 1.1} r={shape.r * 0.18} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
          <circle r={shape.r} fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle r={shape.r * 0.35} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
        </g>
      );
    case "spring":
      return <path d="M-30 0 l5 -9 l8 18 l8 -18 l8 18 l8 -18 l8 18 l8 -18 l5 9" fill="none" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
    case "bolt":
      return (
        <g>
          <ellipse cx={-14} cy={0} rx={5} ry={18} fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x={-10} y={-15} width={6} height={30} fill={fill} stroke={stroke} strokeWidth={sw} />
          <polygon points="-4,-12 9,-12 13,-6 13,6 9,12 -4,12" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <line x1={-4} y1={-4} x2={13} y2={-4} stroke={stroke} strokeWidth={sw * 0.6} />
          <line x1={-4} y1={4} x2={13} y2={4} stroke={stroke} strokeWidth={sw * 0.6} />
          <rect x={13} y={-5} width={shape.len} height={10} fill={fill} stroke={stroke} strokeWidth={sw} />
          {Array.from({ length: Math.floor(shape.len / 5) }, (_, i) => (
            <line key={i} x1={17 + i * 5} y1={-5} x2={20 + i * 5} y2={5} stroke={stroke} strokeWidth={sw * 0.5} />
          ))}
        </g>
      );
    case "damper": {
      const { r } = shape;
      return (
        <g>
          <circle r={r} fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle r={r * 0.78} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          <circle r={r * 0.72} fill="#e9e9e9" stroke={stroke} strokeWidth={sw * 0.7} />
          <circle r={r * 0.62} fill={fill} stroke={stroke} strokeWidth={sw * 0.7} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={Math.cos((i * Math.PI) / 2 + 0.6) * r * 0.42} cy={Math.sin((i * Math.PI) / 2 + 0.6) * r * 0.42} r={r * 0.06} fill="none" stroke={stroke} strokeWidth={sw * 0.6} />
          ))}
          <circle r={r * 0.24} fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle r={r * 0.13} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        </g>
      );
    }
    case "fanclutch": {
      const { r } = shape;
      return (
        <g>
          <circle r={r} fill={fill} stroke={stroke} strokeWidth={sw} />
          {Array.from({ length: 24 }, (_, i) => {
            const a = (i * Math.PI * 2) / 24;
            return <line key={i} x1={Math.cos(a) * r * 0.5} y1={Math.sin(a) * r * 0.5} x2={Math.cos(a) * r * 0.95} y2={Math.sin(a) * r * 0.95} stroke={stroke} strokeWidth={sw * 0.5} />;
          })}
          <circle r={r * 0.45} fill={fill} stroke={stroke} strokeWidth={sw} />
          <path d={`M${-r * 0.25} 0 A${r * 0.25} ${r * 0.25} 0 0 1 ${r * 0.25} 0`} fill="none" stroke={stroke} strokeWidth={sw} />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={Math.cos((i * Math.PI) / 2) * r * 0.33} cy={Math.sin((i * Math.PI) / 2) * r * 0.33} r={r * 0.05} fill={stroke} />
          ))}
        </g>
      );
    }
    case "autotensioner": {
      const { r } = shape;
      return (
        <g>
          <circle cx={r * 1.6} cy={r * 1.3} r={r * 0.75} fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle cx={r * 1.6} cy={r * 1.3} r={r * 0.3} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
          <path d={`M${r * 0.7} ${-r * 0.5} L${r * 2.1} ${r * 0.7} L${r * 1.3} ${r * 1.9} L${-r * 0.2} ${r * 0.6} Z`} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
          <circle r={r} fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle r={r * 0.8} fill="none" stroke={stroke} strokeWidth={sw * 0.5} />
          <circle r={r * 0.32} fill={fill} stroke={stroke} strokeWidth={sw} />
          <polygon points={[0, 1, 2, 3, 4, 5].map((i) => `${(Math.cos((i * Math.PI) / 3) * r * 0.2).toFixed(1)},${(Math.sin((i * Math.PI) / 3) * r * 0.2).toFixed(1)}`).join(" ")} fill="none" stroke={stroke} strokeWidth={sw * 0.7} />
        </g>
      );
    }
    case "ring":
      return (
        <g>
          <circle r={shape.r} fill={fill} stroke={stroke} strokeWidth={sw} />
          <circle r={shape.r * 0.62} fill="#fff" stroke={stroke} strokeWidth={sw} />
        </g>
      );
  }
}

/** Grosor de la pieza en el dibujo: se repite la cara desplazada hacia atrás. */
const depth = (s: PartShape) =>
  s.kind === "damper" ? s.depth : s.kind === "fanclutch" ? 26 : s.kind === "autotensioner" ? 16 : s.kind === "belt" ? 12 : s.kind === "cover" ? 10 : s.kind === "spring" || s.kind === "bolt" ? 0 : s.kind === "ring" ? 3 : s.kind === "pulley" ? 14 : 10;

/** Contorno exterior de una pieza redonda (para dibujar sus gargantas o su canto). */
const outerR = (s: PartShape) => ("r" in s ? s.r : 0);

/** Posiciones (de atrás hacia delante) de los anillos del canto. */
function rings(s: PartShape, d: number): number[] {
  const n = s.kind === "damper" ? s.grooves * 2 : s.kind === "pulley" ? (s.grooves ?? 0) * 2 : 0;
  return Array.from({ length: n }, (_, i) => (d * (n - i)) / (n + 1));
}

/** Dibuja una pieza en perspectiva, con línea fina de taller. Dibujo propio generado por código. */
function Shape({ shape, on }: { shape: PartShape; on: boolean }) {
  const stroke = on ? RED : INK;
  const sw = on ? 2.4 : 1.6;
  const d = depth(shape);
  if (shape.kind === "spring" || shape.kind === "bolt") return <Face shape={shape} stroke={stroke} sw={sw} />;
  return (
    <g>
      {d > 0 && (
        <g transform={`translate(${d * 0.866} ${-d * 0.5}) ${ISO}`}>
          <Face shape={shape} stroke={stroke} sw={sw} />
        </g>
      )}
      {/* Canto: anillos a lo largo del grosor; en poleas con gargantas, uno por garganta */}
      {rings(shape, d).map((t, i) => (
        <g key={i} transform={`translate(${t * 0.866} ${-t * 0.5}) ${ISO}`}>
          <circle r={outerR(shape) * (i % 2 ? 0.93 : 1)} fill="#fff" stroke={stroke} strokeWidth={sw * 0.7} />
        </g>
      ))}
      <g transform={ISO}>
        <Face shape={shape} stroke={stroke} sw={sw} />
      </g>
    </g>
  );
}

const shopUrl = (p: ExplodedPart) => SHOP + encodeURIComponent(p.oe ?? p.search ?? p.name);

/** Despiece interactivo con números pinchables, lista de piezas y enlace de compra en Euro4x4parts. */
export function ExplodedDiagram({ view }: { view: ExplodedView }) {
  const [sel, setSel] = useState<number | null>(null);
  const current = view.parts.find((p) => p.n === sel);

  return (
    <section className="mt-12" aria-label={view.title}>
      <h3 className="t-sub">{view.title}</h3>
      {view.intro && <p className="mt-1 max-w-[65ch] opacity-70">{view.intro}</p>}
      <div className="mt-4 grid gap-5 xl:grid-cols-[1fr_20rem]">
        <div className="relative overflow-hidden rounded-[6px] border-4 border-paper bg-paper">
          <svg viewBox={`0 0 ${view.width} ${view.height}`} className="block w-full" role="img" aria-label={`Despiece: ${view.title}`} style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
            <rect width={view.width} height={view.height} fill="#fff" />
            {view.axis && <line {...view.axis} stroke={INK} strokeWidth={1} strokeDasharray="18 4 3 4" />}
            {view.parts.map((p) => {
              const on = p.n === sel;
              return (
                <g key={p.n} transform={`translate(${p.x} ${p.y})`} onClick={() => setSel(on ? null : p.n)} className="cursor-pointer" role="button" aria-label={`${p.n}. ${p.name}`}>
                  <Shape shape={p.shape} on={on} />
                </g>
              );
            })}
            {view.parts.map((p) => {
              const on = p.n === sel;
              const l = p.label ?? { dx: 0, dy: -70 };
              return (
                <g key={`n${p.n}`} onClick={() => setSel(on ? null : p.n)} className="cursor-pointer">
                  <line x1={p.x} y1={p.y} x2={p.x + l.dx} y2={p.y + l.dy} stroke={on ? RED : INK} strokeWidth={on ? 1.6 : 0.9} />
                  <circle cx={p.x} cy={p.y} r={2.5} fill={on ? RED : INK} />
                  <text x={p.x + l.dx} y={p.y + l.dy + (l.dy < 0 ? -6 : 16)} textAnchor="middle" fontSize={20} fontWeight={on ? 700 : 400} fill={on ? RED : INK}>
                    {p.n}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="t-small absolute bottom-2 right-3 text-midnight-deep/60">Dibujo ACM Motorsport · toca un número</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className={cn("rounded-[6px] border p-4 transition-colors", current ? "border-[#f7c600] bg-[#f7c600]/10" : "border-line")}>
            {current ? (
              <>
                <p className="t-small font-semibold uppercase tracking-[0.14em] text-[#f7c600]">Pieza {current.n}</p>
                <p className="t-sub mt-1">{current.name}</p>
                <dl className="mt-3 grid gap-1 text-sm">
                  {current.qty && current.qty > 1 && <div className="flex justify-between gap-3"><dt className="opacity-60">Cantidad</dt><dd>{current.qty}</dd></div>}
                  <div className="flex justify-between gap-3"><dt className="opacity-60">Referencia</dt><dd className="tnum">{current.oe ?? "por confirmar"}</dd></div>
                  {current.torque && <div className="flex justify-between gap-3"><dt className="opacity-60">Apriete</dt><dd className="font-semibold text-racing-bright">{current.torque}</dd></div>}
                </dl>
                {current.note && <p className="t-small mt-2 opacity-75">{current.note}</p>}
                <a href={shopUrl(current)} rel="sponsored noopener" target="_blank" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-btn)] bg-racing px-4 font-medium text-paper no-underline hover:bg-racing-dark">
                  <ShoppingCart aria-hidden className="size-4" /> Buscar en Euro4x4parts
                </a>
              </>
            ) : (
              <p className="opacity-70">Toca una pieza del dibujo o de la lista para ver su referencia, su apriete y dónde comprarla.</p>
            )}
          </div>
          <ol className="max-h-[26rem] overflow-y-auto rounded-[6px] border border-line">
            {view.parts.map((p) => (
              <li key={p.n}>
                <button type="button" onClick={() => setSel(p.n === sel ? null : p.n)} className={cn("flex w-full items-center gap-3 border-b border-line px-3 py-2 text-left text-sm last:border-b-0", p.n === sel ? "bg-paper/10" : "hover:bg-paper/5")}>
                  <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold", p.n === sel ? "bg-[#f7c600] text-midnight-deep" : "bg-racing text-paper")}>{p.n}</span>
                  <span className="flex-1">{p.name}</span>
                  {p.qty && p.qty > 1 && <span className="opacity-50">×{p.qty}</span>}
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
