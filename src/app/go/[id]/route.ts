import { NextResponse } from "next/server";
import { affiliateById } from "@/content/affiliates";

/**
 * Redirección de afiliados: /go/starlink → enlace de referido.
 * Permite medir clics (logs ahora; tabla `affiliate_clicks` en Fase 3) y cambiar destinos sin tocar artículos.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = affiliateById((await params).id);
  if (!a?.url) return NextResponse.redirect(new URL("/noticias", req.url), 302);
  console.info(`[affiliate-click] ${a.id} ref=${req.headers.get("referer") ?? "-"}`);
  return NextResponse.redirect(a.url, { status: 302, headers: { "X-Robots-Tag": "noindex, nofollow" } });
}
