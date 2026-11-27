import { NextResponse, after } from "next/server";
import { z } from "zod";
import { TEAM_INBOX, html, layout, sendEmail } from "@/lib/email";
import { clientKey, rateLimit } from "@/lib/rate-limit";

/** Respuesta de la encuesta "¿Qué te frena?" de las fichas. Anónima: llega por email al equipo. */
const schema = z.object({
  reason: z.string().min(1).max(60),
  other: z.string().max(280).optional(),
  page: z.string().max(200).optional(),
  product: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  if (!rateLimit(clientKey(req, "encuesta"), 3).ok) return NextResponse.json({ ok: false }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false }, { status: 422 });
  const { reason, other, page, product } = parsed.data;
  console.info("[encuesta]", reason, "|", product ?? page ?? "", other ? `| ${other}` : "");
  after(() =>
    sendEmail({
      to: TEAM_INBOX,
      subject: `Encuesta web · ${reason}${product ? ` · ${product}` : ""}`,
      html: layout({
        title: "Alguien ha contestado la encuesta",
        intro: `¿Qué le frena para comprar? → ${reason}`,
        body: `${other ? `<p style="white-space:pre-line;margin:0 0 12px">“${html.esc(other)}”</p>` : ""}<p style="margin:0;color:#667">${html.esc(product ?? "")} ${page ? `· ${html.esc(page)}` : ""}</p>`,
        foot: "Respuesta anónima de la ficha de producto.",
      }),
      text: `Encuesta: ${reason}${other ? ` — ${other}` : ""}\n${product ?? ""} ${page ?? ""}`,
    }).catch(() => {}),
  );
  return NextResponse.json({ ok: true });
}
