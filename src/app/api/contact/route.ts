import { NextResponse } from "next/server";
import { contactSchema } from "@/domain/contact";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/supabase/service";

/** Guarda el mensaje en la tabla `leads`. Se ve en /admin. Aviso por email cuando haya proveedor. */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "contact"), 5).ok) return NextResponse.json({ ok: false, message: "Demasiados intentos." }, { status: 429 });
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Revisa los campos marcados." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true, message: "Recibido." }); // honeypot

  const supa = db();
  if (!supa) return NextResponse.json({ ok: true, message: "Mensaje recibido. (Modo demo: todavía no se envía a ningún buzón.)" });

  const { topic, name, company, email, message } = parsed.data;
  const { error } = await supa.from("leads").insert({ topic, name, company: company || null, email: email.toLowerCase(), message, consent_at: new Date().toISOString() });
  if (error) {
    console.error("[contact]", error.message);
    return NextResponse.json({ ok: false, message: "No se ha podido enviar. Prueba en un rato o escríbenos por Instagram." }, { status: 500 });
  }
  return NextResponse.json({ ok: true, message: "Mensaje recibido. Te contestamos lo antes posible." });
}
