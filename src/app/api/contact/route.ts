import { NextResponse } from "next/server";
import { contactSchema } from "@/domain/contact";
import { clientKey, rateLimit } from "@/lib/rate-limit";

/** Demo: valida. Fase 3: guardar en tabla `leads` + notificación por email/n8n. */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "contact"), 5).ok) return NextResponse.json({ ok: false, message: "Demasiados intentos." }, { status: 429 });
  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Revisa los campos marcados." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true, message: "Recibido." }); // honeypot
  return NextResponse.json({ ok: true, message: "Mensaje recibido. (Modo demo: todavía no se envía a ningún buzón.)" });
}
