import type { ProductArtKind, ProductPrint } from "@/domain/catalog";
import { cn } from "@/lib/utils";

/**
 * Vista del diseño estampado sobre el color del tejido (modo demo, sin fotos de producto).
 * Se sustituye por los mockups/fotos de Printful en Fase 4.
 */
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55;
}

const D = "var(--font-display)";
const S = "var(--font-sans)";

function Print({ print, kind, ink }: { print: ProductPrint; kind: ProductArtKind; ink: string }) {
  if (kind === "sticker") {
    return (
      <g>
        <g transform="translate(120 130) rotate(-6)"><rect width="150" height="78" rx="10" fill="#101e36" /><text x="75" y="50" textAnchor="middle" fill="#f5f7fa" fontFamily={D} fontSize="34" fontWeight="680" style={{ fontStretch: "125%" }}>ACM</text></g>
        <g transform="translate(150 215) rotate(5)"><rect width="130" height="58" rx="29" fill="#e52435" /><text x="65" y="37" textAnchor="middle" fill="#f5f7fa" fontFamily={S} fontSize="17" fontWeight="600">Objetivo Dakar</text></g>
        <g transform="translate(112 278) rotate(-3)"><rect width="120" height="34" rx="4" fill="#f5f7fa" stroke="#080a0f" strokeOpacity=".15" /><text x="60" y="23" textAnchor="middle" fill="#080a0f" fontFamily={S} fontSize="14" fontWeight="600">ACM Workshop</text></g>
      </g>
    );
  }
  if (kind === "device") {
    return (
      <g>
        <rect x="130" y="120" width="140" height="170" rx="10" fill="#f5f7fa" stroke="#080a0f" strokeOpacity=".12" />
        <rect x="150" y="140" width="100" height="130" rx="4" fill="none" stroke="#080a0f" strokeOpacity=".08" />
        <text x="200" y="330" textAnchor="middle" fill="#080a0f" fontFamily={S} fontSize="15" opacity=".6">Producto de un tercero</text>
      </g>
    );
  }
  switch (print) {
    case "dakar":
      return (
        <g fill={ink}>
          <text x="200" y="175" textAnchor="middle" fontFamily={D} fontSize="40" fontWeight="600" letterSpacing="-1" style={{ fontStretch: "112%" }}>Objetivo Dakar</text>
          <line x1="110" y1="215" x2="290" y2="215" stroke="#e52435" strokeWidth="2.5" />
          {[110, 200, 290].map((x, i) => <circle key={x} cx={x} cy="215" r="6" fill={i === 2 ? "#e52435" : ink} />)}
          {["2026", "2027", "2028"].map((y, i) => <text key={y} x={110 + i * 90} y="250" textAnchor="middle" fontFamily={S} fontSize="15" opacity=".75">{y}</text>)}
        </g>
      );
    case "roadbook":
      return (
        <g fill="none" stroke={ink} strokeWidth="2">
          <rect x="95" y="130" width="210" height="130" />
          <line x1="165" y1="130" x2="165" y2="260" />
          <line x1="245" y1="130" x2="245" y2="260" />
          <text x="130" y="190" textAnchor="middle" fill={ink} stroke="none" fontFamily={D} fontSize="24" fontWeight="600">128</text>
          <text x="130" y="214" textAnchor="middle" fill={ink} stroke="none" fontFamily={S} fontSize="13" opacity=".7">,40 km</text>
          <circle cx="205" cy="228" r="7" fill={ink} />
          <path d="M205 228 V178 M205 200 L232 168" strokeWidth="3" />
          <path d="M226 166 L234 166 L234 174" strokeWidth="3" />
          <text x="275" y="200" textAnchor="middle" fill={ink} stroke="none" fontFamily={S} fontSize="14">CAP</text>
          <text x="275" y="220" textAnchor="middle" fill={ink} stroke="none" fontFamily={S} fontSize="14">45°</text>
        </g>
      );
    case "workshop":
      return (
        <g fill={ink}>
          <circle cx="200" cy="200" r="78" fill="none" stroke={ink} strokeWidth="2" />
          <circle cx="200" cy="200" r="62" fill="none" stroke={ink} strokeWidth="1" opacity=".5" />
          <text x="200" y="198" textAnchor="middle" fontFamily={D} fontSize="34" fontWeight="680" style={{ fontStretch: "125%" }}>ACM</text>
          <text x="200" y="222" textAnchor="middle" fontFamily={S} fontSize="14" fontWeight="600">Workshop</text>
        </g>
      );
    case "sim":
      return (
        <g fill={ink}>
          <path d="M100 210 C130 210 140 160 170 160 S210 240 240 230 S280 180 300 185" fill="none" stroke="#e52435" strokeWidth="3" />
          <text x="200" y="265" textAnchor="middle" fontFamily={D} fontSize="26" fontWeight="600" style={{ fontStretch: "112%" }}>ACM Sim Racing</text>
        </g>
      );
    default:
      return (
        <g fill={ink}>
          <text x="200" y="205" textAnchor="middle" fontFamily={D} fontSize={kind === "keyring" ? 54 : 64} fontWeight="680" letterSpacing="-2" style={{ fontStretch: "125%" }}>ACM</text>
          <text x="200" y="236" textAnchor="middle" fontFamily={S} fontSize="17" fontWeight="500" opacity=".8">Motorsport</text>
        </g>
      );
  }
}

export function ProductArt({ kind, print, color, className, showDemoTag = true }: { kind: ProductArtKind; print: ProductPrint; color: string; className?: string; showDemoTag?: boolean }) {
  const neutralTile = kind === "sticker" || kind === "device";
  const bg = neutralTile ? "#e7ebf1" : color;
  const light = isLight(bg);
  const ink = light ? "#080a0f" : "#f5f7fa";
  return (
    <div className={cn("relative isolate overflow-hidden", className)} style={{ backgroundColor: bg }}>
      {!neutralTile && <div className="grain absolute inset-0" aria-hidden />}
      <svg viewBox="0 0 400 400" className="relative h-full w-full" role="img" aria-label="Vista del diseño">
        <Print print={print} kind={kind} ink={ink} />
      </svg>
      {showDemoTag && <span className={cn("absolute bottom-3 left-3 text-[0.72rem]", light ? "text-ink/50" : "text-paper/50")}>Vista del diseño</span>}
    </div>
  );
}
