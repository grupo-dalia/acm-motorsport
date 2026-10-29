/**
 * Genera public/globe/dots.bin: puntos sobre tierra firme para el globo 3D.
 * Formato: Int16Array plano [lat*100, lon*100, flag, ...]; flag 1 = país de la ruta (ES, MA, SA), con rejilla más densa.
 * Datos: Natural Earth vía world-atlas (dominio público). Ejecutar: node scripts/build-globe-data.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoContains, geoBounds } from "d3-geo";

const land = JSON.parse(readFileSync("node_modules/world-atlas/land-110m.json", "utf8"));
const countries = JSON.parse(readFileSync("node_modules/world-atlas/countries-50m.json", "utf8"));
const landF = feature(land, land.objects.land);
const all = feature(countries, countries.objects.countries).features;
const route = all.filter((f) => ["724", "504", "682"].includes(String(f.id)));
const routeBounds = route.map((f) => geoBounds(f));

const STEP = 1.1; // grados entre filas
const out = [];
for (let lat = -58; lat <= 82; lat += STEP) {
  const n = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / STEP));
  for (let i = 0; i < n; i++) {
    const lon = -180 + (i + 0.5) * (360 / n);
    const p = [lon, lat];
    let flag = 0;
    for (let k = 0; k < route.length; k++) {
      const [[w, s], [e, nn]] = routeBounds[k];
      if (lon >= w && lon <= e && lat >= s && lat <= nn && geoContains(route[k], p)) { flag = 1; break; }
    }
    if (!flag && geoContains(landF, p)) out.push(Math.round(lat * 100), Math.round(lon * 100), 0);
  }
}
// Países de la ruta: rejilla más densa para que destaquen al acercar la cámara
const FINE = 0.42;
route.forEach((f, k) => {
  const [[w, s], [e, n]] = routeBounds[k];
  for (let lat = s; lat <= n; lat += FINE) {
    const step = FINE / Math.cos((lat * Math.PI) / 180);
    for (let lon = w; lon <= e; lon += step) {
      if (geoContains(f, [lon, lat])) out.push(Math.round(lat * 100), Math.round(lon * 100), 1);
    }
  }
});
const buf = Buffer.from(new Int16Array(out).buffer);
writeFileSync("public/globe/dots.bin", buf);
console.log(`${out.length / 3} puntos, ${(buf.length / 1024).toFixed(1)} KB`);
