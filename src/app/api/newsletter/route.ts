import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/supabase/service";

const schema = z.object({ email: z.email().max(160), consent: z.literal(true), website: z.string().max(0).optional().nullable() });

/** Guarda la suscripción en Supabase. El doble opt-in llegará con el proveedor de email. */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "newsletter"), 5).ok) return NextResponse.json({ ok: false, message: "Demasiados intentos." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Revisa el email y acepta la política de privacidad." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true, message: "¡Dentro!" }); // honeypot

  const supa = db();
  if (!supa) return NextResponse.json({ ok: true, message: "¡Dentro! (Modo demo: la suscripción aún no se almacena.)" });

  const source = safePath(req.headers.get("referer"));
  const { error } = await supa
    .from("newsletter_subscribers")
    .upsert({ email: parsed.data.email.toLowerCase(), consent_at: new Date().toISOString(), unsubscribed_at: null, source }, { onConflict: "email" });
  if (error) {
    console.error("[newsletter]", error.message);
    return NextResponse.json({ ok: false, message: "No hemos podido guardarte. Prueba en un rato." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, message: "¡Dentro! Te escribiremos cuando haya algo que contar." });
}

function safePath(ref: string | null) {
  try {
    return ref ? new URL(ref).pathname.slice(0, 200) : null;
  } catch {
    return null;
  }
}
