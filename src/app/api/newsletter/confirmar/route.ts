import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/service";
import { verifyNewsletterToken } from "@/lib/email";

/** Enlace del correo de confirmación (doble opt-in). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("e") ?? "").toLowerCase();
  const ok = verifyNewsletterToken(email, "confirm", url.searchParams.get("t") ?? "");
  const supa = db();
  if (!ok || !supa) return NextResponse.redirect(new URL("/newsletter?estado=error", req.url), 303);
  const { error } = await supa.from("newsletter_subscribers").update({ confirmed_at: new Date().toISOString(), unsubscribed_at: null }).eq("email", email);
  return NextResponse.redirect(new URL(`/newsletter?estado=${error ? "error" : "confirmada"}`, req.url), 303);
}
