import "server-only";
import { geoMercator, geoPath, geoBounds, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import { presimplify, simplify, quantile } from "topojson-simplify";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import world from "world-atlas/countries-50m.json";

/**
 * Mapa de la ruta España → Marruecos → Arabia Saudí, generado en build a partir
 * de Natural Earth (world-atlas, dominio público). Sale como SVG estático: 0 KB de JS en cliente.
 */
export const MAP_W = 1600;
export const MAP_H = 1000;

// Encuadre geográfico [lon, lat]
const WEST = -60, EAST = 57, SOUTH = 12, NORTH = 47;

// ISO 3166-1 numérico
const HIGHLIGHT = new Set(["724", "504", "682"]); // España, Marruecos, Arabia Saudí

export type Stop = { id: string; label: string; year: number; event: string; lon: number; lat: number; anchor: "start" | "end"; dy: number };

export const stops: Stop[] = [
  { id: "es", label: "España", year: 2026, event: "Offroad Classic Cup", lon: -3.7, lat: 40.2, anchor: "start", dy: -6 },
  { id: "ma", label: "Marruecos", year: 2027, event: "CERTT · Rallye du Maroc", lon: -4.6, lat: 30.6, anchor: "start", dy: 92 },
  { id: "sa", label: "Arabia Saudí", year: 2028, event: "Dakar", lon: 42.5, lat: 23.6, anchor: "end", dy: 56 },
];

let cache: ReturnType<typeof build> | null = null;

function build() {
  // Simplificación topológica (conserva fronteras compartidas) para aligerar el SVG
  const raw = world as unknown as Topology<{ countries: GeometryCollection }>;
  const pre = presimplify(raw as never);
  const topo = simplify(pre, quantile(pre, 0.12)) as unknown as Topology<{ countries: GeometryCollection }>;
  const countries = feature(topo, topo.objects.countries) as FeatureCollection<Geometry, { name: string }>;

  const projection: GeoProjection = geoMercator().fitExtent(
    [[0, 0], [MAP_W, MAP_H]],
    { type: "Feature", properties: {}, geometry: { type: "MultiPoint", coordinates: [[WEST, SOUTH], [EAST, NORTH]] } } as Feature,
  );
  projection.clipExtent([[-10, -10], [MAP_W + 10, MAP_H + 10]]); // descarta todo lo que queda fuera del encuadre
  const path = geoPath(projection).digits(0);

  const inView = countries.features.filter((f) => {
    const [[w, s], [e, n]] = geoBounds(f);
    return e > WEST - 5 && w < EAST + 5 && n > SOUTH - 5 && s < NORTH + 5 && Math.abs(e - w) < 300;
  });

  const land = inView.filter((f) => !HIGHLIGHT.has(String(f.id))).map((f) => path(f) ?? "").join("");
  const highlight = inView.filter((f) => HIGHLIGHT.has(String(f.id))).map((f) => path(f) ?? "").join("");

  const pts = stops.map((s) => {
    const [x, y] = projection([s.lon, s.lat])!;
    return { ...s, x: Math.round(x), y: Math.round(y) };
  });

  // Curvas suaves entre etapas: España → Marruecos (cruza el Estrecho) → Arabia (a lo largo del Sáhara)
  const [a, b, c] = pts as [typeof pts[number], typeof pts[number], typeof pts[number]];
  const viaMed = projection([-5.6, 35.9])!; // Estrecho de Gibraltar
  const viaSahara = projection([12, 27.5])!;
  const viaEgypt = projection([31, 27])!;
  const route = [
    `M${a.x} ${a.y}`,
    `C${a.x - 40} ${a.y + 120} ${viaMed[0] + 30} ${viaMed[1] - 40} ${viaMed[0]} ${viaMed[1]}`,
    `S${b.x + 30} ${b.y - 90} ${b.x} ${b.y}`,
    `C${b.x + 160} ${b.y + 30} ${viaSahara[0] - 120} ${viaSahara[1] + 20} ${viaSahara[0]} ${viaSahara[1]}`,
    `S${viaEgypt[0] - 120} ${viaEgypt[1] - 40} ${viaEgypt[0]} ${viaEgypt[1]}`,
    `S${c.x - 120} ${c.y - 50} ${c.x} ${c.y}`,
  ].join(" ");

  return { land, highlight, stops: pts, route };
}

export function routeMap() {
  cache ??= build();
  return cache;
}
