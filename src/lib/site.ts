/** Dominio definitivo (comprado en Cloudflare). */
export const PRODUCTION_URL = "https://www.acmmotorsport.com";

/**
 * URL pública absoluta. Orden: variable explícita → dominio definitivo en producción →
 * URL del despliegue de Vercel → localhost. Imprescindible para que las previsualizaciones
 * al compartir (WhatsApp, Telegram, redes) encuentren la imagen Open Graph.
 */
function resolveSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const siteUrl = resolveSiteUrl().replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
