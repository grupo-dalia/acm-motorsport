/**
 * Curvas de nivel generadas de forma determinista (sin Math.random → sin errores de hidratación).
 * Evocan cartografía de rally raid. Puro SVG, coste de render despreciable.
 */
function contourPath(cx: number, cy: number, r: number, seed: number, points = 72) {
  const pts: string[] = [];
  for (let i = 0; i <= points; i++) {
    const a = (i / points) * Math.PI * 2;
    const wobble =
      1 +
      0.16 * Math.sin(a * 3 + seed) +
      0.09 * Math.sin(a * 5 + seed * 1.7) +
      0.05 * Math.cos(a * 7 + seed * 0.6);
    const x = cx + Math.cos(a) * r * wobble * 1.35;
    const y = cy + Math.sin(a) * r * wobble;
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pts.join(" ") + "Z";
}

const systems = [
  { cx: 260, cy: 300, rings: 11, step: 34, seed: 1.3 },
  { cx: 1180, cy: 640, rings: 14, step: 38, seed: 4.1 },
  { cx: 1500, cy: 120, rings: 7, step: 30, seed: 2.6 },
];

const paths = systems.flatMap((s) =>
  Array.from({ length: s.rings }, (_, i) => ({ d: contourPath(s.cx, s.cy, 30 + i * s.step, s.seed + i * 0.22), major: i % 5 === 4 })),
);

export function Contours({ className, animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden fill="none">
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke="currentColor"
          strokeWidth={p.major ? 1.2 : 0.6}
          opacity={p.major ? 0.5 : 0.28}
          {...(animate ? { pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1, className: "animate-draw", style: { animationDelay: `${(i % 14) * 90}ms` } } : {})}
        />
      ))}
    </svg>
  );
}

/** Trazado de ruta con waypoints, para heros y separadores. */
export function RouteLine({ className }: { className?: string }) {
  const d = "M-20 760 C 180 700, 260 560, 420 590 S 700 720, 820 560 S 1000 300, 1160 360 S 1420 520, 1620 260";
  return (
    <svg className={className} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden fill="none">
      <path d={d} stroke="currentColor" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" opacity="0.9" />
      {[
        [420, 590, "CP1"],
        [820, 560, "CP2"],
        [1160, 360, "CP3"],
      ].map(([x, y, l]) => (
        <g key={String(l)} transform={`translate(${x} ${y})`}>
          <circle r="7" fill="var(--color-ink)" stroke="currentColor" strokeWidth="2" />
          <text x="14" y="-12" fill="currentColor" fontFamily="var(--font-mono)" fontSize="13" letterSpacing="2">{l}</text>
        </g>
      ))}
    </svg>
  );
}
