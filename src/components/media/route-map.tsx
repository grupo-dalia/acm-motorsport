import { MAP_H, MAP_W, routeMap } from "@/lib/route-map";
import { cn } from "@/lib/utils";

/**
 * Mapa de la ruta a Dakar (SVG estático generado en servidor).
 * La línea se dibuja una sola vez al cargar; respeta reduced-motion vía CSS global.
 */
export function RouteMap({ className, align = "xMidYMid", animate = true, labels = true }: { className?: string; align?: "xMidYMid" | "xMaxYMid" | "xMinYMid"; animate?: boolean; labels?: boolean }) {
  const { land, highlight, stops, route } = routeMap();
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio={`${align} slice`} className={cn("block", className)} aria-hidden>
      <path d={land} fill="rgb(245 247 250 / 0.055)" stroke="rgb(245 247 250 / 0.10)" strokeWidth="0.8" />
      <path d={highlight} fill="rgb(245 247 250 / 0.13)" stroke="rgb(245 247 250 / 0.28)" strokeWidth="0.8" />
      <path d={route} fill="none" stroke="var(--color-racing)" strokeWidth="2.6" strokeLinecap="round" pathLength={1} className={animate ? "route-draw" : undefined} />
      {stops.map((s, i) => (
        <g key={s.id} className={animate ? "route-stop" : undefined} style={animate ? { animationDelay: `${0.7 + i * 1.1}s` } : undefined}>
          {i === 0 && <circle cx={s.x} cy={s.y} r="7" fill="var(--color-racing)" className="pulse-ring" />}
          <circle cx={s.x} cy={s.y} r="7" fill="var(--color-paper)" stroke="var(--color-racing)" strokeWidth="3" />
          {labels && (
            <g className="max-lg:hidden" transform={`translate(${s.x + (s.anchor === "start" ? 22 : -22)} ${s.y + s.dy})`} textAnchor={s.anchor}>
              <text fill="var(--color-paper)" fontFamily="var(--font-display)" fontSize="38" fontWeight="560" letterSpacing="-0.5" style={{ fontStretch: "110%" }}>
                {s.year}
              </text>
              <text y="32" fill="var(--color-steel)" fontFamily="var(--font-sans)" fontSize="21">
                {s.label} · {s.event}
              </text>
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}
