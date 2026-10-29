import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { MAP_H, MAP_W, routeMap } from "@/lib/route-map";

export const alt = "ACM Motorsport. No es solo motor. Es una forma de vivir. Ruta España, Marruecos, Arabia Saudí.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

/** Imagen para compartir en WhatsApp, Telegram, X, LinkedIn… Se genera en build. */
export default async function OG() {
  const [hubot, mona] = await Promise.all([font("hubot-sans", "hubot-sans-latin-600-normal.woff"), font("mona-sans", "mona-sans-latin-400-normal.woff")]);
  const { land, highlight, route, stops } = routeMap();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_W} ${MAP_H}">
    <path d="${land}" fill="rgba(245,247,250,0.07)" stroke="rgba(245,247,250,0.12)" stroke-width="1"/>
    <path d="${highlight}" fill="rgba(245,247,250,0.16)" stroke="rgba(245,247,250,0.3)" stroke-width="1"/>
    <path d="${route}" fill="none" stroke="#E52435" stroke-width="5" stroke-linecap="round"/>
    ${stops.map((s) => `<circle cx="${s.x}" cy="${s.y}" r="11" fill="#F5F7FA" stroke="#E52435" stroke-width="5"/>`).join("")}
  </svg>`;
  const mapSrc = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#101E36", color: "#F5F7FA", fontFamily: "Mona" }}>
        <img src={mapSrc} width={960} height={600} style={{ position: "absolute", left: 300, top: 30 }} alt="" />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(90deg, #101E36 0%, #101E36 38%, rgba(16,30,54,0) 58%)" }} />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span style={{ fontFamily: "Hubot", fontSize: 38, letterSpacing: -1 }}>ACM</span>
            <span style={{ fontSize: 24, opacity: 0.7 }}>Motorsport</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 560 }}>
            <div style={{ fontFamily: "Hubot", fontSize: 70, lineHeight: 1.02, letterSpacing: -2.5 }}>No es solo motor. Es una forma de vivir.</div>
            <div style={{ marginTop: 26, fontSize: 26, color: "#9299A7" }}>Rumbo al Dakar 2028 con un Pajero de 1989</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Hubot", data: hubot, weight: 600, style: "normal" },
        { name: "Mona", data: mona, weight: 400, style: "normal" },
      ],
    },
  );
}
