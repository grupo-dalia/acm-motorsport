import localFont from "next/font/local";

/**
 * Fuentes autoalojadas (OFL), sin peticiones a terceros. next/font genera el
 * fallback métrico para evitar CLS.
 *  - Hubot Sans: grotesca técnica con eje de anchura → titulares.
 *  - Mona Sans: su pareja de texto, muy legible en párrafos e interfaz.
 */
export const hubot = localFont({
  src: "../../node_modules/@fontsource-variable/hubot-sans/files/hubot-sans-latin-wdth-normal.woff2",
  weight: "200 900",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
  variable: "--font-hubot",
  display: "swap",
});

export const mona = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-normal.woff2", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/mona-sans/files/mona-sans-latin-wdth-italic.woff2", style: "italic" },
  ],
  weight: "200 900",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
  variable: "--font-mona",
  display: "swap",
});
