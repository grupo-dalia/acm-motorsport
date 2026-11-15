import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ManualVehicle } from "@/content/manual-types";

export const manualOgSize = { width: 1200, height: 630 };

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

async function photoData(vehicle: ManualVehicle) {
  if (!vehicle.photo) return null;
  try {
    const buf = await readFile(join(process.cwd(), "public", vehicle.basePath, vehicle.photo.file));
    const type = vehicle.photo.file.endsWith(".png") ? "png" : "jpeg";
    return `data:image/${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * Tarjeta de vista previa (Open Graph) de un manual: marca ACM, bandera, «Manual de taller» y el coche,
 * con su foto si la hay. Es lo que se ve al pegar el enlace en WhatsApp, Telegram o redes.
 */
export async function manualOgImage(vehicle: ManualVehicle) {
  const [hubot, hubotXb, mona, monaSb, photo] = await Promise.all([
    font("hubot-sans", "hubot-sans-latin-800-italic.woff"),
    font("hubot-sans", "hubot-sans-latin-900-italic.woff"),
    font("mona-sans", "mona-sans-latin-500-normal.woff"),
    font("mona-sans", "mona-sans-latin-600-normal.woff"),
    photoData(vehicle),
  ]);
  // Marca en una línea y modelo en otra: Satori no calcula bien el alto de un texto que se parte solo.
  const [line1, ...rest] = vehicle.model.split(" ");
  const line2 = rest.join(" ");
  const W = manualOgSize.width;
  const H = manualOgSize.height;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", color: "#fff", fontFamily: "Mona", backgroundImage: "radial-gradient(circle at 78% 30%, #1d3fa6, #132e86 30%, #0a1a52 62%, #050c25)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
        {photo && <img src={photo} width={760} height={H} style={{ position: "absolute", right: 0, top: 0, objectFit: "cover" }} alt="" />}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", backgroundImage: "linear-gradient(90deg, #050c25 0%, rgba(5,12,37,0.96) 38%, rgba(5,12,37,0.35) 62%, rgba(5,12,37,0.05) 100%)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", backgroundImage: "linear-gradient(0deg, rgba(5,12,37,0.85) 0%, rgba(5,12,37,0) 35%)" }} />

        {/* Logo */}
        <div style={{ position: "absolute", left: 0, top: 48, display: "flex", alignItems: "center", gap: 14, background: "#0a1a44", padding: "12px 40px 12px 56px", borderLeft: "8px solid #e3141e" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#fff", "#fff", "#e3141e"].map((c, i) => (
              <div key={i} style={{ width: 9, height: 34, background: c, transform: "skewX(-22deg)" }} />
            ))}
          </div>
          <span style={{ fontFamily: "HubotXb", fontSize: 34 }}>
            AC<span style={{ color: "#e3141e" }}>M</span>
          </span>
          <span style={{ fontFamily: "MonaSb", fontSize: 18, letterSpacing: 6, color: "#c9d3ee" }}>MOTORSPORT</span>
        </div>

        <div style={{ position: "absolute", left: 64, bottom: 64, display: "flex", flexDirection: "column", maxWidth: 680 }}>
          <div style={{ display: "flex" }}>
            <span style={{ background: "#e3141e", fontFamily: "MonaSb", fontSize: 22, letterSpacing: 3, padding: "8px 22px", textTransform: "uppercase" }}>Manual de taller interactivo</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 22, fontFamily: "HubotXb", fontSize: 84, lineHeight: 1, letterSpacing: -2, textTransform: "uppercase" }}>
            <span>{line1}</span>
            {line2 && <span style={{ color: "#ff4555" }}>{line2}</span>}
          </div>
          <span style={{ fontFamily: "Hubot", fontSize: 30, marginTop: 14, color: "#c9d3ee", textTransform: "uppercase" }}>
            {vehicle.chassis} · {vehicle.years}
          </span>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <div style={{ width: 86, height: 12, background: "#e3141e", transform: "skewX(-30deg)" }} />
            <div style={{ width: 170, height: 12, background: "#f7c600", transform: "skewX(-30deg)" }} />
            <div style={{ width: 86, height: 12, background: "#e3141e", transform: "skewX(-30deg)" }} />
          </div>
          <span style={{ fontSize: 24, marginTop: 22, color: "#c9d3ee" }}>{vehicle.engine} · aprietes, capacidades y paso a paso</span>
        </div>

        <div style={{ position: "absolute", right: 0, bottom: 0, display: "flex", background: "#e3141e", padding: "12px 28px", fontFamily: "MonaSb", fontSize: 22, letterSpacing: 2 }}>ACMMOTORSPORT.COM</div>
      </div>
    ),
    {
      ...manualOgSize,
      fonts: [
        { name: "Hubot", data: hubot, weight: 800, style: "normal" },
        { name: "HubotXb", data: hubotXb, weight: 900, style: "normal" },
        { name: "Mona", data: mona, weight: 500, style: "normal" },
        { name: "MonaSb", data: monaSb, weight: 600, style: "normal" },
      ],
    },
  );
}
