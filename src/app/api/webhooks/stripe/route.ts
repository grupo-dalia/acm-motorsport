import { NextResponse, after } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/integrations/payments/stripe";
import { markOrderPaid, sendToProduction, setOrderStatus } from "@/integrations/commerce";
import { TEAM_INBOX, html, layout, sendEmail } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";

/**
 * Webhook de Stripe. Única vía por la que un pedido pasa a "pagado".
 * Eventos a activar en el Dashboard (Desarrolladores → Webhooks → endpoint …/api/webhooks/stripe):
 *   checkout.session.completed, checkout.session.async_payment_succeeded,
 *   checkout.session.async_payment_failed, checkout.session.expired
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "not_configured" }, { status: 400 });

  const body = await req.text(); // cuerpo sin procesar: imprescindible para verificar la firma
  let event: Stripe.Event;
  try {
    event = await stripe().webhooks.constructEventAsync(body, signature, secret);
  } catch (e) {
    console.error("[stripe] firma no válida", e instanceof Error ? e.message : e);
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        if (session.payment_status !== "paid") break; // pagos diferidos: llegará async_payment_succeeded
        const reference = session.client_reference_id ?? session.metadata?.order;
        if (!reference) break;
        const order = await markOrderPaid(reference, {
          sessionId: session.id,
          paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : (session.payment_intent?.id ?? null),
          amountCents: session.amount_total,
        });
        if (!order) break; // ya procesado (Stripe reintenta) o pedido desconocido
        after(async () => {
          await sendToProduction(order);
          await notify(order, session);
        });
        break;
      }
      case "checkout.session.async_payment_failed": {
        const s = event.data.object;
        const ref = s.client_reference_id ?? s.metadata?.order;
        if (ref) await setOrderStatus(ref, "payment_failed", { session: s.id });
        break;
      }
      case "checkout.session.expired": {
        const s = event.data.object;
        const ref = s.client_reference_id ?? s.metadata?.order;
        if (ref) await setOrderStatus(ref, "cancelled", { session: s.id, reason: "expired" });
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error("[stripe] webhook", event.type, e);
    return NextResponse.json({ error: "handler_failed" }, { status: 500 }); // Stripe reintentará
  }
  return NextResponse.json({ received: true });
}

type PaidOrder = NonNullable<Awaited<ReturnType<typeof markOrderPaid>>>;

async function notify(order: PaidOrder, session: Stripe.Checkout.Session) {
  const list = `<ul style="margin:0;padding-left:18px">${order.totals.lines.map((l) => `<li>${l.qty}× ${html.esc(l.name)} · ${formatPrice(l.totalCents)}</li>`).join("")}</ul>`;
  const totals = `<p style="margin:12px 0 0">Envío: ${formatPrice(order.totals.shippingCents)}${order.totals.discountCents ? ` · Descuento: −${formatPrice(order.totals.discountCents)}` : ""}<br><strong>Total pagado: ${formatPrice(session.amount_total ?? order.totals.totalCents)}</strong></p>`;
  const c = order.customer;
  await sendEmail({
    to: c.email,
    subject: `Pedido ${order.id} confirmado · ACM Motorsport`,
    html: layout({
      title: "¡Pedido confirmado!",
      intro: `Gracias, ${c.name.split(" ")[0]}. Tu pago se ha recibido y tu pedido entra en producción: cada prenda se imprime para ti, así que suele tardar de 2 a 5 días laborables en salir y de 3 a 6 más en llegar. Te avisaremos cuando esté en camino.`,
      body: `${list}${totals}<p style="margin:12px 0 0;color:#565e6e">Envío a: ${html.esc([c.address1, c.address2, `${c.postalCode} ${c.city}`, c.province].filter(Boolean).join(", "))}</p><p style="margin:12px 0 0;color:#565e6e">La factura te llega en un correo aparte de Stripe.</p>`,
      cta: { href: absoluteUrl("/tienda"), label: "Seguir mirando" },
      foot: `Referencia ${order.id}. ¿Algún problema? Responde a este correo o escribe a hola@acmmotorsport.com.`,
    }),
    text: `Pedido ${order.id} confirmado. Total: ${formatPrice(session.amount_total ?? order.totals.totalCents)}.`,
    replyTo: TEAM_INBOX,
  });
  await sendEmail({
    to: TEAM_INBOX,
    subject: `${order.mode === "live" ? "" : "[Prueba] "}Venta ${order.id} · ${formatPrice(session.amount_total ?? order.totals.totalCents)}`,
    html: layout({ title: `${order.mode === "live" ? "Nueva venta" : "Venta de prueba"} ${order.id}`, intro: `${c.name} · ${c.email} · ${c.city}`, body: `${list}${totals}`, cta: { href: absoluteUrl("/admin"), label: "Ver en el panel" } }),
    text: `Venta ${order.id} · ${c.name}`,
  });
}
