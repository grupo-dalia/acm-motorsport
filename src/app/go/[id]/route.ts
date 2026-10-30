import { NextResponse, after } from "next/server";
import { affiliateById } from "@/content/affiliates";
import { db } from "@/lib/supabase/service";

/**
 * Redirección de afiliados: /go/starlink → enlace de referido.
 * Registra el clic (afiliado, página de origen y país aproximado; sin IP) después de responder,
 * para no retrasar la redirección.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const a = affiliateById((await params).id);
  if (!a?.url) return NextResponse.redirect(new URL("/noticias", req.url), 302);

  let path: string | null = null;
  try {
    const ref = req.headers.get("referer");
    path = ref ? new URL(ref).pathname.slice(0, 200) : null;
  } catch {}
  const country = req.headers.get("x-vercel-ip-country");
  const bot = /bot|crawl|spider|preview|facebookexternalhit|whatsapp/i.test(req.headers.get("user-agent") ?? "");

  after(async () => {
    const supa = db();
    if (!supa || bot) return;
    const { error } = await supa.from("affiliate_clicks").insert({ affiliate: a.id, path, country });
    if (error) console.error("[affiliate-click]", error.message);
  });

  return NextResponse.redirect(a.url, { status: 302, headers: { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" } });
}
