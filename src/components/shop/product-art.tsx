import type { ProductArtKind, ProductPrint } from "@/domain/catalog";
import { cn } from "@/lib/utils";

/**
 * Ilustración vectorial de producto para el modo demo (no son fotos reales).
 * Se sustituye por las imágenes/mockups de Printful en Fase 4.
 */
function luminance(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

const SHAPES: Record<Exclude<ProductArtKind, "sticker">, string> = {
  tee: "M140 70 L110 80 L50 120 L72 178 L110 162 L110 340 L290 340 L290 162 L328 178 L350 120 L290 80 L260 70 C250 92 228 104 200 104 C172 104 150 92 140 70 Z",
  hoodie: "M150 78 C150 40 250 40 250 78 L300 92 L352 140 L330 260 L300 250 L300 350 L100 350 L100 250 L70 260 L48 140 L100 92 Z",
  cap: "M110 230 C110 140 290 140 290 230 Z M110 230 L290 230 C330 232 352 246 350 258 C300 254 180 252 110 246 Z",
  beanie: "M120 250 C120 140 280 140 280 250 Z M110 250 L290 250 L290 300 L110 300 Z",
  mug: "M120 130 L270 130 L270 320 C270 330 260 338 250 338 L140 338 C130 338 120 330 120 320 Z M270 170 C330 170 330 280 270 280 L270 258 C304 258 304 192 270 192 Z",
  keyring: "M130 150 L290 150 C300 150 308 158 308 168 L308 282 C308 292 300 300 290 300 L130 300 C120 300 112 292 112 282 L112 168 C112 158 120 150 130 150 Z",
  device: "M110 110 L290 110 C298 110 304 116 304 124 L304 296 C304 304 298 310 290 310 L110 310 C102 310 96 304 96 296 L96 124 C96 116 102 110 110 110 Z",
};

const PRINT_POS: Partial<Record<ProductArtKind, { x: number; y: number; s: number }>> = {
  tee: { x: 200, y: 170, s: 1 },
  hoodie: { x: 200, y: 175, s: 1 },
  cap: { x: 200, y: 200, s: 0.8 },
  beanie: { x: 200, y: 278, s: 0.6 },
  mug: { x: 195, y: 235, s: 0.72 },
  keyring: { x: 210, y: 228, s: 1.05 },
  device: { x: 200, y: 210, s: 0.7 },
};

function Print({ print, ink, x, y, s }: { print: ProductPrint; ink: string; x: number; y: number; s: number }) {
  const label = { acm: "ACM", dakar: "DAKAR", stripe: "ACM", workshop: "WORKSHOP", sim: "SIM", roadbook: "CAP 128°" }[print];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <text textAnchor="middle" y="0" fill={ink} fontFamily="var(--font-display)" fontWeight="900" fontStyle="italic" fontSize={label.length > 5 ? 26 : 40} style={{ fontStretch: "120%" }}>
        {label}
      </text>
      <g transform="translate(-22 10)">
        <rect width="11" height="5" fill="#e52435" />
        <rect x="11" width="22" height="5" fill="#f1bf00" />
        <rect x="33" width="11" height="5" fill="#e52435" />
      </g>
      {print === "dakar" && (
        <text textAnchor="middle" y="34" fill={ink} fontFamily="var(--font-mono)" fontSize="11" letterSpacing="3" opacity="0.8">OBJETIVO · 2028</text>
      )}
    </g>
  );
}

export function ProductArt({ kind, print, color, className, showDemoTag = true }: { kind: ProductArtKind; print: ProductPrint; color: string; className?: string; showDemoTag?: boolean }) {
  const ink = luminance(color) > 0.55 ? "#0b0d12" : "#f5f7fa";
  const pos = PRINT_POS[kind];
  return (
    <div className={cn("relative isolate overflow-hidden bg-surface", className)}>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_40%,#1b2536_0%,transparent_65%)]" />
      <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="Ilustración de producto (demo)">
        <ellipse cx="200" cy="362" rx="120" ry="10" fill="#000" opacity="0.35" />
        {kind === "sticker" ? (
          <g>
            <g transform="rotate(-8 150 170)"><rect x="80" y="110" width="150" height="110" rx="14" fill="#101e36" stroke="#f5f7fa" strokeWidth="5" /><Print print="acm" ink="#f5f7fa" x={155} y={172} s={0.9} /></g>
            <g transform="rotate(10 260 250)"><rect x="190" y="200" width="140" height="100" rx="50" fill="#e52435" stroke="#f5f7fa" strokeWidth="5" /><Print print="dakar" ink="#f5f7fa" x={260} y={248} s={0.7} /></g>
            <g transform="rotate(-4 140 290)"><rect x="90" y="262" width="110" height="56" rx="8" fill="#f5f7fa" /><Print print="workshop" ink="#0b0d12" x={145} y={292} s={0.55} /></g>
          </g>
        ) : (
          <>
            <path d={SHAPES[kind]} fill={color} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" fillRule="evenodd" />
            <path d={SHAPES[kind]} fill="url(#shade)" fillRule="evenodd" />
            {kind === "keyring" && <circle cx="140" cy="130" r="26" fill="none" stroke="#c9ced6" strokeWidth="6" />}
            {kind === "device" && <rect x="120" y="134" width="160" height="152" rx="6" fill="none" stroke="rgba(0,0,0,0.12)" />}
            {pos && <Print print={print} ink={ink} {...pos} />}
          </>
        )}
        <defs>
          <linearGradient id="shade" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#000" stopOpacity="0.25" />
          </linearGradient>
        </defs>
      </svg>
      {showDemoTag && (
        <span className="absolute bottom-2.5 left-3 font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper/40">Ilustración · demo</span>
      )}
    </div>
  );
}
