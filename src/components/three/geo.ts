import { Vector3 } from "three";

/** lat/lon (grados) → vector en la esfera. lon 0, lat 0 mira a +Z (hacia la cámara). */
export function latLon(lat: number, lon: number, r = 1, target = new Vector3()) {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return target.set(r * Math.cos(la) * Math.sin(lo), r * Math.sin(la), r * Math.cos(la) * Math.cos(lo));
}

export const ROUTE = [
  { id: "es", lat: 40.2, lon: -3.7 },
  { id: "ma", lat: 30.6, lon: -4.6 },
  { id: "sa", lat: 23.6, lon: 42.5 },
] as const;

/** Vistas de cámara por tramo del scroll (progress 0..1). */
export const VIEWS = [
  { p: 0.0, lat: 30, lon: 14, dist: 3.9 },
  { p: 0.22, lat: 37, lon: 0, dist: 2.75 },
  { p: 0.47, lat: 32, lon: 2, dist: 2.7 },
  { p: 0.72, lat: 27, lon: 24, dist: 2.85 },
  { p: 1.0, lat: 30, lon: 18, dist: 3.1 },
];

export function viewAt(p: number) {
  for (let i = 0; i < VIEWS.length - 1; i++) {
    const a = VIEWS[i]!, b = VIEWS[i + 1]!;
    if (p <= b.p) {
      const t = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p)));
      const e = t * t * (3 - 2 * t);
      return { lat: a.lat + (b.lat - a.lat) * e, lon: a.lon + (b.lon - a.lon) * e, dist: a.dist + (b.dist - a.dist) * e };
    }
  }
  return VIEWS[VIEWS.length - 1]!;
}

/** Progreso de cada tramo de la ruta según el scroll. */
export const LEGS = [
  { from: 0, to: 1, start: 0.3, end: 0.47, lift: 0.06 },
  { from: 1, to: 2, start: 0.54, end: 0.74, lift: 0.2 },
] as const;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
