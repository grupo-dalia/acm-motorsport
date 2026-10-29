import localFont from "next/font/local";

/**
 * Fuentes autoalojadas (OFL) desde paquetes @fontsource: sin peticiones a terceros,
 * con preload y fallback ajustado por next/font para evitar CLS.
 * Archivo: variable con eje de anchura (62–125 %) → titulares expandidos y texto normal con una sola familia.
 */
export const archivo = localFont({
  src: [
    { path: "../../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2", style: "normal" },
    { path: "../../node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-italic.woff2", style: "italic" },
  ],
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  variable: "--font-archivo",
  display: "swap",
});

export const jetbrains = localFont({
  src: "../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
  display: "swap",
});
