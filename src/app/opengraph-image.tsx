import { ImageResponse } from "next/og";

export const alt = "ACM Motorsport — No es solo motor. Es una forma de vivir.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "linear-gradient(135deg,#101E36 0%,#080A0F 70%)", color: "#F5F7FA", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 44, fontWeight: 900, fontStyle: "italic" }}>ACM</div>
          <div style={{ display: "flex", flexDirection: "column", width: 8, height: 34 }}>
            <div style={{ flex: 1, background: "#E52435" }} /><div style={{ flex: 2, background: "#F1BF00" }} /><div style={{ flex: 1, background: "#E52435" }} />
          </div>
          <div style={{ fontSize: 22, letterSpacing: 6, color: "#9299A7" }}>MOTORSPORT</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 900, lineHeight: 0.95, textTransform: "uppercase" }}>
          <span>No es solo motor.</span>
          <span style={{ color: "#E52435", fontStyle: "italic" }}>Es una forma de vivir.</span>
        </div>
        <div style={{ fontSize: 24, color: "#9299A7", letterSpacing: 4 }}>OBJETIVO DAKAR · 2026 → 2028</div>
      </div>
    ),
    size,
  );
}
