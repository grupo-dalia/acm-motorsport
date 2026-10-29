import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getSeasons } from "@/lib/series";

export const alt = "Objetivo Dakar · Serie documental de ACM Motorsport · Temporada 1";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const revalidate = 3600;

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules/@fontsource", pkg, "files", file));

/** Dunas nocturnas en SVG (determinista) para cuando no hay portada de capítulo. */
function dunesSvg() {
  const W = 1200, H = 630;
  const layer = (base: number, amp: number, f1: number, f2: number, ph: number) => {
    let d = `M0 ${H} L0 ${base}`;
    for (let x = 0; x <= W; x += 12) {
      const y = base - amp * (0.55 * Math.sin(x * f1 + ph) + 0.3 * Math.sin(x * f2 + ph * 2.1) + 0.15 * Math.sin(x * f1 * 3.3 + ph));
      d += ` L${x} ${y.toFixed(1)}`;
    }
    return d + ` L${W} ${H} Z`;
  };
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const stars = Array.from({ length: 90 }, () => `<circle cx="${(rnd() * W).toFixed(0)}" cy="${(rnd() * 300).toFixed(0)}" r="${(rnd() * 1.1 + 0.3).toFixed(2)}" fill="#dfe7fb" opacity="${(rnd() * 0.6 + 0.15).toFixed(2)}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050913"/><stop offset="0.55" stop-color="#0e1d3a"/><stop offset="1" stop-color="#1b315c"/></linearGradient>
      <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#b9c9ef" stop-opacity="0.45"/><stop offset="1" stop-color="#b9c9ef" stop-opacity="0"/></radialGradient>
      <linearGradient id="d1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a6aa8"/><stop offset="0.35" stop-color="#22396a"/><stop offset="1" stop-color="#0d1830"/></linearGradient>
      <linearGradient id="d2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34507f"/><stop offset="0.3" stop-color="#1a2c52"/><stop offset="1" stop-color="#080f20"/></linearGradient>
      <linearGradient id="d3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22365e"/><stop offset="0.3" stop-color="#101d38"/><stop offset="1" stop-color="#05090f"/></linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sky)"/>
    ${stars}
    <circle cx="905" cy="170" r="150" fill="url(#moonGlow)"/>
    <circle cx="905" cy="170" r="34" fill="#eef2fc"/>
    <path d="${layer(385, 38, 0.0042, 0.011, 0.6)}" fill="url(#d1)"/>
    <path d="${layer(450, 55, 0.0031, 0.008, 2.2)}" fill="url(#d2)"/>
    <path d="${layer(530, 70, 0.0024, 0.0065, 4.1)}" fill="url(#d3)"/>
    <path d="M140 548 C 360 520, 520 470, 760 455 S 1080 430, 1200 418" fill="none" stroke="#e52435" stroke-width="2.5" stroke-dasharray="2 9" stroke-linecap="round" opacity="0.85"/>
  </svg>`;
}

async function cover(id: string) {
  try {
    const res = await fetch(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) return null; // imagen gris de "no disponible"
    return `data:image/jpeg;base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OG() {
  const [hubot, hubotXb, mona, monaSb, seasons] = await Promise.all([
    font("hubot-sans", "hubot-sans-latin-600-normal.woff"),
    font("hubot-sans", "hubot-sans-latin-800-normal.woff"),
    font("mona-sans", "mona-sans-latin-500-normal.woff"),
    font("mona-sans", "mona-sans-latin-600-normal.woff"),
    getSeasons().catch(() => []),
  ]);
  const s1 = seasons[0];
  const chapters = s1?.episodes.filter((e) => e.status === "disponible" && e.number > 0) ?? [];
  const latest = [...chapters].reverse().find((e) => e.youtubeId);
  const bg = (latest?.youtubeId && (await cover(latest.youtubeId))) || `data:image/svg+xml;base64,${Buffer.from(dunesSvg()).toString("base64")}`;
  const count = chapters.length;
  const hasPilot = Boolean(s1?.episodes.some((e) => e.number === 0));

  const raw = latest?.synopsis ?? s1?.synopsis ?? "";
  const synopsis = raw.length <= 115 ? raw : `${raw.slice(0, 115).replace(/[\s,;:.]+\S*$/, "")}…`;
  const playLabel = latest ? `Reproducir T${latest.season}:E${latest.number}` : "Ver la serie";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#080A0F", color: "#F5F7FA", fontFamily: "Mona" }}>
        <img src={bg} width={1200} height={630} style={{ position: "absolute", left: 0, top: 0, objectFit: "cover" }} alt="" />
        {/* Mismo tratamiento que la portada de la web */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(90deg, rgba(8,10,15,0.94) 0%, rgba(8,10,15,0.72) 36%, rgba(8,10,15,0) 70%)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 630, display: "flex", backgroundImage: "linear-gradient(0deg, rgba(8,10,15,0.9) 0%, rgba(8,10,15,0) 42%, rgba(8,10,15,0) 80%, rgba(8,10,15,0.45) 100%)" }} />

        <div style={{ position: "absolute", left: 64, top: 50, display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{ fontFamily: "HubotXb", fontSize: 30, letterSpacing: -1 }}>ACM</span>
          <span style={{ fontFamily: "MonaSb", fontSize: 20, color: "rgba(245,247,250,0.75)" }}>Motorsport</span>
        </div>

        <div style={{ position: "absolute", left: 64, bottom: 64, display: "flex", flexDirection: "column", maxWidth: 640 }}>
          <span style={{ fontFamily: "MonaSb", fontSize: 22, color: "rgba(245,247,250,0.85)" }}>Serie documental · ACM Motorsport</span>
          <span style={{ fontFamily: "Hubot", fontSize: 92, lineHeight: 1, letterSpacing: -3.5, marginTop: 12 }}>Objetivo Dakar</span>
          <div style={{ marginTop: 18, display: "flex", gap: 18, fontSize: 24, color: "rgba(245,247,250,0.85)" }}>
            <span style={{ fontFamily: "MonaSb", color: "#fff" }}>Temporada 1</span>
            <span>2026</span>
            <span>{count > 0 ? `${count} capítulos${hasPilot ? " + piloto" : ""}` : "Ya disponible"}</span>
          </div>
          {synopsis && <span style={{ marginTop: 14, fontSize: 23, lineHeight: 1.35, color: "rgba(245,247,250,0.85)", maxWidth: 560 }}>{synopsis}</span>}
          <div style={{ marginTop: 26, display: "flex", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#F5F7FA", color: "#080A0F", fontFamily: "MonaSb", fontSize: 22, padding: "14px 24px", borderRadius: 5 }}>
              <svg width="15" height="17" viewBox="0 0 12 14"><path d="M0 0l12 7-12 7z" fill="#080A0F" /></svg>
              {playLabel}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(245,247,250,0.18)", color: "#F5F7FA", fontFamily: "MonaSb", fontSize: 22, padding: "14px 24px", borderRadius: 5 }}>
              <svg width="15" height="17" viewBox="0 0 12 14"><path d="M0 0l12 7-12 7z" fill="#F5F7FA" /></svg>
              Desde el capítulo 1
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Hubot", data: hubot, weight: 600, style: "normal" },
        { name: "HubotXb", data: hubotXb, weight: 800, style: "normal" },
        { name: "Mona", data: mona, weight: 500, style: "normal" },
        { name: "MonaSb", data: monaSb, weight: 600, style: "normal" },
      ],
    },
  );
}
