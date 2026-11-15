import type { ExplodedPart, ExplodedView, PartShape } from "@/content/manual-types";

/**
 * Despiece de la distribución del 4D56 (Pajero III). Dibujo propio de ACM generado por código:
 * cada pieza se coloca en el plano del motor (X a la derecha, Y hacia abajo, en mm aproximados)
 * y se separa hacia delante según el orden en que se desmonta.
 * Datos de las correas: kits de distribución del 4D56 del mercado (163 dientes × 25,4 mm y 99 dientes × 19 mm).
 */

const ORIGIN = { x: 660, y: 420 };
const K = 1.15; // escala del plano del motor
const STEP = 62; // separación hacia delante por capa

/** Plano del motor en perspectiva + separación hacia delante. */
function at(X: number, Y: number, layer: number): { x: number; y: number } {
  return {
    x: Math.round(ORIGIN.x + X * K * 0.866 - layer * STEP * 0.866),
    y: Math.round(ORIGIN.y + X * K * 0.5 + Y * K + layer * STEP * 0.5),
  };
}

type Def = Omit<ExplodedPart, "x" | "y"> & { X: number; Y: number; layer: number };

const S = (shape: PartShape) => shape;
const search4d56 = (q: string) => `${q} 4D56`;

const defs: Def[] = [
  { n: 1, name: "Polea tensora del aire acondicionado", search: search4d56("polea tensora aire acondicionado"), shape: S({ kind: "tensioner", r: 20 }), X: 150, Y: -60, layer: 9, label: { dx: 150, dy: -20 } },
  { n: 2, name: "Correa de accesorios (alternador y dirección)", search: search4d56("correa accesorios"), shape: S({ kind: "belt", w: 230, h: 120, teeth: false }), X: 40, Y: -10, layer: 8, label: { dx: -150, dy: 110 } },
  { n: 3, name: "Tensor automático de la correa de accesorios", search: search4d56("tensor automatico correa"), torque: "44 ± 10 N·m", shape: S({ kind: "tensioner", r: 22 }), X: 130, Y: 40, layer: 7, label: { dx: 120, dy: 40 } },
  { n: 4, name: "Embrague del ventilador (viscoso)", search: search4d56("embrague viscoso ventilador"), torque: "11 ± 1 N·m", shape: S({ kind: "pulley", r: 46, grooves: 0 }), X: 40, Y: -90, layer: 7, label: { dx: -20, dy: -130 } },
  { n: 5, name: "Polea de la bomba de agua", search: search4d56("polea bomba agua"), torque: "11 ± 1 N·m", shape: S({ kind: "pulley", r: 38, grooves: 3 }), X: 40, Y: -90, layer: 6, label: { dx: 80, dy: -110 } },
  { n: 6, name: "Tapa superior de la distribución", search: search4d56("tapa distribucion"), torque: "11 ± 1 N·m", shape: S({ kind: "cover", w: 200, h: 130 }), X: 0, Y: -190, layer: 5, label: { dx: -40, dy: -150 } },
  { n: 7, name: "Tornillo de la polea del cigüeñal", search: search4d56("tornillo polea cigueñal"), torque: "177 ± 9 N·m", note: "Con aceite de motor en la rosca.", shape: S({ kind: "bolt", len: 40 }), X: 0, Y: 0, layer: 9.5, label: { dx: -90, dy: 40 } },
  { n: 8, name: "Polea del cigüeñal", search: search4d56("polea cigueñal damper"), shape: S({ kind: "pulley", r: 62, grooves: 3 }), X: 0, Y: 0, layer: 7.5, label: { dx: -170, dy: -30 } },
  { n: 9, name: "Tapa inferior de la distribución", search: search4d56("tapa inferior distribucion"), torque: "11 ± 1 N·m", note: "En el motor de 2002 detrás van el sensor de ángulo del cigüeñal y su paleta.", shape: S({ kind: "cover", w: 220, h: 120 }), X: 30, Y: -20, layer: 4.5, label: { dx: -190, dy: 10 } },
  { n: 10, name: "Correa de distribución", qty: 1, search: search4d56("correa distribucion"), note: "163 dientes y 25,4 mm de ancho en los kits del 4D56. Cámbiala con su tensor.", shape: S({ kind: "belt", w: 250, h: 330 }), X: -10, Y: -125, layer: 2.5, label: { dx: -250, dy: -60 } },
  { n: 11, name: "Tensor de la correa de distribución", search: search4d56("tensor correa distribucion"), torque: "26 ± 3 N·m", shape: S({ kind: "tensioner", r: 24 }), X: 70, Y: -110, layer: 2, label: { dx: 130, dy: -50 } },
  { n: 12, name: "Muelle del tensor", search: search4d56("muelle tensor distribucion"), shape: S({ kind: "spring" }), X: 120, Y: -60, layer: 2, label: { dx: 60, dy: -100 } },
  { n: 13, name: "Brida delantera del piñón del cigüeñal", search: search4d56("brida piñon cigueñal"), shape: S({ kind: "ring", r: 34 }), X: 0, Y: 0, layer: 3.4, label: { dx: -130, dy: 90 } },
  { n: 14, name: "Piñón del cigüeñal", search: search4d56("piñon cigueñal distribucion"), shape: S({ kind: "sprocket", r: 32, teeth: 20 }), X: 0, Y: 0, layer: 2.5, label: { dx: -40, dy: 140 } },
  { n: 15, name: "Brida trasera", search: search4d56("brida piñon cigueñal"), shape: S({ kind: "ring", r: 34 }), X: 0, Y: 0, layer: 1.7, label: { dx: 30, dy: 150 } },
  { n: 16, name: "Correa B (ejes de equilibrado)", search: search4d56("correa ejes equilibrado"), note: "99 dientes y 19 mm de ancho en los kits del 4D56.", shape: S({ kind: "belt", w: 160, h: 110 }), X: 60, Y: 10, layer: 0.8, label: { dx: 190, dy: 60 } },
  { n: 17, name: "Tensor de la correa B", search: search4d56("tensor correa equilibrado"), torque: "26 ± 3 N·m", shape: S({ kind: "tensioner", r: 16 }), X: 95, Y: 40, layer: 0.6, label: { dx: 150, dy: 110 } },
  { n: 18, name: "Muelle del tensor B", search: search4d56("muelle tensor equilibrado"), shape: S({ kind: "spring" }), X: 120, Y: 70, layer: 0.6, label: { dx: 110, dy: 130 } },
  { n: 19, name: "Piñón B del cigüeñal", search: search4d56("piñon B cigueñal"), shape: S({ kind: "sprocket", r: 22, teeth: 14 }), X: 0, Y: 0, layer: 0.6, label: { dx: 70, dy: 160 } },
  { n: 20, name: "Piñón del eje de equilibrado", search: search4d56("piñon eje equilibrado"), shape: S({ kind: "sprocket", r: 26, teeth: 16 }), X: 130, Y: 0, layer: 0, label: { dx: 150, dy: -40 } },
  { n: 21, name: "Piñón del árbol de levas", search: search4d56("piñon arbol levas"), torque: "69 ± 5 N·m", shape: S({ kind: "sprocket", r: 58, teeth: 30 }), X: 50, Y: -250, layer: 0, label: { dx: 80, dy: -90 } },
  { n: 22, name: "Piñón de la bomba inyectora", search: search4d56("piñon bomba inyectora"), shape: S({ kind: "sprocket", r: 58, teeth: 30 }), X: -100, Y: -160, layer: 0, label: { dx: -130, dy: -70 } },
];

export const distribucion4d56: ExplodedView = {
  title: "Despiece de la distribución",
  intro: "Las piezas en el orden en que salen, de la más cercana a ti (abajo a la izquierda) a la que va pegada al motor. Toca un número para ver la pieza, su apriete y dónde comprarla.",
  width: 1150,
  height: 860,
  axis: { ...(() => { const a = at(0, 0, 11); const b = at(0, 0, -1.5); return { x1: a.x, y1: a.y, x2: b.x, y2: b.y }; })() },
  // Se pintan de atrás hacia delante para que lo de delante tape lo de detrás.
  parts: [...defs].sort((a, b) => a.layer - b.layer).map(({ X, Y, layer, ...p }) => ({ ...p, ...at(X, Y, layer) })),
};
