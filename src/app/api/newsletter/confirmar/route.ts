import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/service";
import { after } from "next/server";
import { emailConfigured, layout, newsletterLink, sendEmail, verifyNewsletterToken } from "@/lib/email";
import { CLUB_COUPON } from "@/domain/cart";
import { absoluteUrl } from "@/lib/site";

/** Enlace del correo de confirmación (doble opt-in). */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("e") ?? "").toLowerCase();
  const ok = verifyNewsletterToken(email, "confirm", url.searchParams.get("t") ?? "");
  const supa = db();
  if (!ok || !supa) return NextResponse.redirect(new URL("/newsletter?estado=error", req.url), 303);
  // Solo la primera confirmación lleva el regalo de bienvenida.
  const { data: prev } = await supa.from("newsletter_subscribers").select("confirmed_at").eq("email", email).maybeSingle();
  const { error } = await supa.from("newsletter_subscribers").update({ confirmed_at: new Date().toISOString(), unsubscribed_at: null }).eq("email", email);
  if (!error && !prev?.confirmed_at && emailConfigured()) after(() => sendWelcome(email));
  return NextResponse.redirect(new URL(`/newsletter?estado=${error ? "error" : "confirmada"}`, req.url), 303);
}

/** Bienvenida al Club ACM con el código de descuento. */
function sendWelcome(email: string) {
  const shop = absoluteUrl("/tienda");
  return sendEmail({
    to: email,
    subject: `Bienvenido al Club ACM: tu 10 % es ${CLUB_COUPON}`,
    html: layout({
      title: "Ya eres del Club ACM",
      intro: `Gracias por apuntarte. Tu regalo: un 10 % de descuento en tu primer pedido de la tienda con el código ${CLUB_COUPON}. Escríbelo en la cesta, justo antes de pagar.`,
      body: `<p style="margin:0 0 12px;font-size:28px;font-weight:800;letter-spacing:2px;color:#d91f30">${CLUB_COUPON}</p><p style="margin:0">Te escribiremos solo cuando haya algo que contar: camisetas nuevas, ofertas para el club, crónicas de carrera y guías nuevas de los manuales.</p>`,
      cta: { href: shop, label: "Ir a la tienda" },
      foot: `¿Ya no quieres recibir correos? <a href="${newsletterLink(email, "unsubscribe")}" style="color:#9299a7">Darte de baja</a>.`,
    }),
    text: `Ya eres del Club ACM. Tu código: ${CLUB_COUPON} (10 % en tu primer pedido). Tienda: ${shop}\n\nBaja: ${newsletterLink(email, "unsubscribe")}`,
  });
}
