import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/service";
import { verifyNewsletterToken } from "@/lib/email";

/** Darse de baja con un clic (enlace al pie de cada envío). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("e") ?? "").toLowerCase();
  const ok = verifyNewsletterToken(email, "unsubscribe", url.searchParams.get("t") ?? "");
  const supa = db();
  if (!ok || !supa) return NextResponse.redirect(new URL("/newsletter?estado=error", req.url), 303);
  const { error } = await supa.from("newsletter_subscribers").update({ unsubscribed_at: new Date().toISOString() }).eq("email", email);
  return NextResponse.redirect(new URL(`/newsletter?estado=${error ? "error" : "baja"}`, req.url), 303);
}
