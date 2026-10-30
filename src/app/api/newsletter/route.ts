import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { after } from "next/server";
import { db } from "@/lib/supabase/service";
import { emailConfigured, layout, newsletterLink, sendEmail } from "@/lib/email";

const schema = z.object({ email: z.email().max(160), consent: z.literal(true), website: z.string().max(0).optional().nullable() });

/** Guarda la suscripción y, si hay proveedor de email, pide confirmarla (doble opt-in). */
export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "newsletter"), 5).ok) return NextResponse.json({ ok: false, message: "Demasiados intentos." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Revisa el email y acepta la política de privacidad." }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true, message: "¡Dentro!" }); // honeypot

  const supa = db();
  if (!supa) return NextResponse.json({ ok: true, message: "¡Dentro! (Modo demo: la suscripción aún no se almacena.)" });

  const email = parsed.data.email.toLowerCase();
  const source = safePath(req.headers.get("referer"));
  const { data, error } = await supa
    .from("newsletter_subscribers")
    .upsert({ email, consent_at: new Date().toISOString(), unsubscribed_at: null, source }, { onConflict: "email" })
    .select("confirmed_at")
    .single();
  if (error) {
    console.error("[newsletter]", error.message);
    return NextResponse.json({ ok: false, message: "No hemos podido guardarte. Prueba en un rato." }, { status: 500 });
  }
  if (data?.confirmed_at) return NextResponse.json({ ok: true, message: "Ya estabas dentro. ¡Gracias!" });
  if (!emailConfigured()) return NextResponse.json({ ok: true, message: "¡Dentro! Te escribiremos cuando haya algo que contar." });

  after(() =>
    sendEmail({
      to: email,
      subject: "Confirma tu suscripción a ACM Motorsport",
      html: layout({
        title: "Un clic y estás dentro",
        intro: "Confirma que quieres recibir los nuevos capítulos de Objetivo Dakar, crónicas de carrera y novedades de la tienda. Pocas veces y solo cuando haya algo que contar.",
        cta: { href: newsletterLink(email, "confirm"), label: "Confirmar suscripción" },
        foot: "Si no te has apuntado tú, ignora este correo y no volverás a saber de nosotros.",
      }),
      text: `Confirma tu suscripción a ACM Motorsport: ${newsletterLink(email, "confirm")}\n\nSi no te has apuntado tú, ignora este correo.`,
    }),
  );
  return NextResponse.json({ ok: true, message: "¡Casi! Te hemos enviado un correo para confirmar." });
}

function safePath(ref: string | null) {
  try {
    return ref ? new URL(ref).pathname.slice(0, 200) : null;
  } catch {
    return null;
  }
}
