import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/site";

/**
 * Correos transaccionales con Resend (API HTTP, sin dependencias).
 * Sin EMAIL_PROVIDER_API_KEY no se envía nada y la web sigue funcionando.
 */
const FROM = process.env.EMAIL_FROM || `ACM Motorsport <${site.email}>`;
/** Buzón del equipo: hola@ se reenvía al Gmail de Andrés. */
export const TEAM_INBOX = site.email;

export function emailConfigured() {
  return Boolean(process.env.EMAIL_PROVIDER_API_KEY);
}

export async function sendEmail(msg: { to: string; subject: string; html: string; text: string; replyTo?: string }) {
  const key = process.env.EMAIL_PROVIDER_API_KEY;
  if (!key) return { ok: false as const, skipped: true as const };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [msg.to], subject: msg.subject, html: msg.html, text: msg.text, reply_to: msg.replyTo }),
    });
    if (!res.ok) {
      console.error("[email]", res.status, (await res.text()).slice(0, 300));
      return { ok: false as const };
    }
    return { ok: true as const };
  } catch (e) {
    console.error("[email]", e);
    return { ok: false as const };
  }
}

// ───────── Plantilla ─────────

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** HTML sencillo y robusto (tablas e estilos en línea) con la identidad de ACM. */
export function layout({ title, intro, body = "", cta, foot }: { title: string; intro: string; body?: string; cta?: { href: string; label: string }; foot?: string }) {
  return `<!doctype html><html lang="es"><body style="margin:0;background:#f5f7fa;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#080a0f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fa;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden">
<tr><td style="background:#101e36;padding:22px 28px;color:#f5f7fa;font-weight:800;font-size:20px;letter-spacing:-0.5px">ACM <span style="font-weight:500;font-size:14px;opacity:.7">Motorsport</span></td></tr>
<tr><td style="padding:32px 28px 8px"><h1 style="margin:0 0 12px;font-size:24px;line-height:1.2">${esc(title)}</h1><p style="margin:0;font-size:16px;line-height:1.6;color:#565e6e">${esc(intro)}</p></td></tr>
${body ? `<tr><td style="padding:16px 28px 0;font-size:15px;line-height:1.6">${body}</td></tr>` : ""}
${cta ? `<tr><td style="padding:24px 28px 8px"><a href="${cta.href}" style="display:inline-block;background:#d91f30;color:#ffffff;text-decoration:none;font-weight:600;padding:14px 22px;border-radius:4px">${esc(cta.label)}</a></td></tr>` : ""}
<tr><td style="padding:28px;font-size:12px;line-height:1.5;color:#9299a7">${foot ? `${foot}<br>` : ""}ACM Motorsport · <a href="${absoluteUrl("/")}" style="color:#9299a7">acmmotorsport.com</a></td></tr>
</table></td></tr></table></body></html>`;
}

export const html = { esc };

// ───────── Tokens firmados para la newsletter (sin tabla extra) ─────────

function secret() {
  return process.env.NEWSLETTER_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function newsletterToken(email: string, purpose: "confirm" | "unsubscribe") {
  return createHmac("sha256", secret()).update(`${purpose}:${email.toLowerCase()}`).digest("base64url").slice(0, 32);
}

export function verifyNewsletterToken(email: string, purpose: "confirm" | "unsubscribe", token: string) {
  if (!secret() || !token) return false;
  const a = Buffer.from(newsletterToken(email, purpose));
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function newsletterLink(email: string, purpose: "confirm" | "unsubscribe") {
  const q = new URLSearchParams({ e: email.toLowerCase(), t: newsletterToken(email, purpose) });
  return absoluteUrl(`/api/newsletter/${purpose === "confirm" ? "confirmar" : "baja"}?${q}`);
}
