import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const recambiosOgSize = { width: 1200, height: 630 };

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));
const dataUrl = async (path: string, type: string) => `data:${type};base64,${(await readFile(join(process.cwd(), "public", path))).toString("base64")}`;

/** Vista previa del enlace de /tienda/recambios: ACM × Euro4x4parts, con el Pajero bajo el arco de Euro4x4parts. */
export async function recambiosOgImage() {
  const [hubot, hubotXb, mona, monaSb, photo, e4x, mitsu, lada] = await Promise.all([
    font("hubot-sans", "hubot-sans-latin-800-italic.woff"),
    font("hubot-sans", "hubot-sans-latin-900-italic.woff"),
    font("mona-sans", "mona-sans-latin-500-normal.woff"),
    font("mona-sans", "mona-sans-latin-600-normal.woff"),
    dataUrl("media/selva-salida-euro4x4parts.jpg", "image/jpeg"),
    dataUrl("sponsors/euro4x4parts-blanco.svg", "image/svg+xml"),
    dataUrl("marcas/mitsubishi.svg", "image/svg+xml"),
    dataUrl("marcas/lada.svg", "image/svg+xml"),
  ]);
  const { width: W, height: H } = recambiosOgSize;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", color: "#fff", fontFamily: "Mona", backgroundImage: "radial-gradient(circle at 78% 30%, #1d3fa6, #132e86 30%, #0a1a52 62%, #050c25)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
        <img src={photo} width={780} height={H} style={{ position: "absolute", right: 0, top: 0, objectFit: "cover", objectPosition: "70% 50%" }} alt="" />
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", backgroundImage: "linear-gradient(90deg, #050c25 0%, rgba(5,12,37,0.97) 40%, rgba(5,12,37,0.45) 62%, rgba(5,12,37,0.05) 100%)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, display: "flex", backgroundImage: "linear-gradient(0deg, rgba(5,12,37,0.9) 0%, rgba(5,12,37,0) 32%)" }} />

        {/* ACM × Euro4x4parts */}
        <div style={{ position: "absolute", left: 0, top: 44, display: "flex", alignItems: "center", gap: 14, background: "#0a1a44", padding: "12px 32px 12px 56px", borderLeft: "8px solid #e3141e" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#fff", "#fff", "#e3141e"].map((c, i) => (
              <div key={i} style={{ width: 9, height: 34, background: c, transform: "skewX(-22deg)" }} />
            ))}
          </div>
          <span style={{ fontFamily: "HubotXb", fontSize: 34 }}>
            AC<span style={{ color: "#e3141e" }}>M</span>
          </span>
          <span style={{ fontFamily: "MonaSb", fontSize: 18, letterSpacing: 6, color: "#c9d3ee" }}>MOTORSPORT</span>
          <span style={{ fontFamily: "HubotXb", fontSize: 30, color: "#f7c600", margin: "0 10px" }}>×</span>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
          <img src={e4x} width={210} height={42} alt="Euro4x4parts" />
        </div>

        <div style={{ position: "absolute", left: 64, bottom: 96, display: "flex", flexDirection: "column", maxWidth: 720 }}>
          <div style={{ display: "flex" }}>
            <span style={{ background: "#e3141e", fontFamily: "MonaSb", fontSize: 22, letterSpacing: 3, padding: "8px 22px", textTransform: "uppercase" }}>Recambios 4x4</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 20, fontFamily: "HubotXb", fontSize: 66, lineHeight: 1, letterSpacing: -2, textTransform: "uppercase" }}>
            <span style={{ whiteSpace: "nowrap" }}>Lo que montamos</span>
            <span style={{ color: "#ff4555" }}>en el taller</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            <div style={{ width: 86, height: 12, background: "#e3141e", transform: "skewX(-30deg)" }} />
            <div style={{ width: 170, height: 12, background: "#f7c600", transform: "skewX(-30deg)" }} />
            <div style={{ width: 86, height: 12, background: "#e3141e", transform: "skewX(-30deg)" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
            <img src={mitsu} width={46} height={40} alt="" />
            <span style={{ fontSize: 26, color: "#c9d3ee" }}>Pajero</span>
            {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse solo admite <img> */}
            <img src={lada} width={110} height={40} alt="" />
            <span style={{ fontSize: 26, color: "#c9d3ee" }}>Niva · por marca y modelo</span>
          </div>
        </div>

        <div style={{ position: "absolute", right: 0, bottom: 0, display: "flex", background: "#e3141e", padding: "12px 28px", fontFamily: "MonaSb", fontSize: 22, letterSpacing: 2 }}>ACMMOTORSPORT.COM/TIENDA/RECAMBIOS</div>
      </div>
    ),
    {
      ...recambiosOgSize,
      fonts: [
        { name: "Hubot", data: hubot, weight: 800, style: "normal" },
        { name: "HubotXb", data: hubotXb, weight: 900, style: "normal" },
        { name: "Mona", data: mona, weight: 500, style: "normal" },
        { name: "MonaSb", data: monaSb, weight: 600, style: "normal" },
      ],
    },
  );
}
