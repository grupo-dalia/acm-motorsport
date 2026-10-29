import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.email().max(160), consent: z.literal(true), website: z.string().max(0).optional().nullable() });

/** Demo: valida y responde. Fase 3: guardar en Supabase (doble opt-in) o enviar a la herramienta de email. */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "newsletter"), 5).ok) return NextResponse.json({ ok: false, message: "Demasiados intentos." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Revisa el email y acepta la política de privacidad." }, { status: 422 });
  return NextResponse.json({ ok: true, message: "¡Dentro! (Modo demo: la suscripción aún no se almacena.)" });
}
