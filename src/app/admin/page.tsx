import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { currentAdmin } from "@/lib/supabase/auth";
import { db } from "@/lib/supabase/service";
import { formatPrice } from "@/lib/format";
import { affiliates } from "@/content/affiliates";
import { logout, toggleLeadHandled } from "./actions";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, string> = {
  pending_payment: "Pendiente de pago",
  paid: "Pagado",
  payment_failed: "Pago fallido",
  in_production: "En producción",
  shipped: "Enviado",
  delivered: "Entregado",
  incident: "Incidencia",
  refunded: "Reembolsado",
  cancelled: "Cancelado",
};

const dt = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });

export default async function AdminPage() {
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login");
  const supa = db()!;
  const since30 = daysAgo(30);

  const [orders, leads, subs, subsCount, clicks] = await Promise.all([
    supa.from("orders").select("id, reference, created_at, status, mode, email, customer_name, total_cents, order_items(name, qty)").order("created_at", { ascending: false }).limit(25),
    supa.from("leads").select("id, created_at, topic, name, company, email, message, handled_at").order("created_at", { ascending: false }).limit(30),
    supa.from("newsletter_subscribers").select("email, consent_at, source, unsubscribed_at").order("consent_at", { ascending: false }).limit(15),
    supa.from("newsletter_subscribers").select("email", { count: "exact", head: true }).is("unsubscribed_at", null),
    supa.from("affiliate_clicks").select("affiliate, path").gte("created_at", since30).limit(5000),
  ]);

  const clicksBy = new Map<string, number>();
  const pagesBy = new Map<string, number>();
  for (const c of clicks.data ?? []) {
    clicksBy.set(c.affiliate, (clicksBy.get(c.affiliate) ?? 0) + 1);
    if (c.path) pagesBy.set(c.path, (pagesBy.get(c.path) ?? 0) + 1);
  }
  const topPages = [...pagesBy.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const pendingLeads = (leads.data ?? []).filter((l) => !l.handled_at).length;
  const realOrders = (orders.data ?? []).filter((o) => o.mode !== "demo");

  return (
    <Container>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="t-small text-slate">{admin.email}</p>
          <h1 className="t-display mt-2">Panel</h1>
        </div>
        <form action={logout}><Button variant="outline" size="sm">Salir</Button></form>
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] bg-line-dark lg:grid-cols-4">
        <Stat label="Pedidos reales" value={realOrders.length} hint={`${(orders.data ?? []).length - realOrders.length} de prueba`} />
        <Stat label="Mensajes sin atender" value={pendingLeads} />
        <Stat label="Suscriptores" value={subsCount.count ?? 0} />
        <Stat label="Clics a afiliados (30 días)" value={clicks.data?.length ?? 0} />
      </dl>

      <Section title="Pedidos" empty={!orders.data?.length} emptyText="Todavía no hay pedidos.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead className="t-small text-slate"><tr className="border-b border-line-dark"><th className="py-3 pr-4 font-normal">Fecha</th><th className="py-3 pr-4 font-normal">Pedido</th><th className="py-3 pr-4 font-normal">Cliente</th><th className="py-3 pr-4 font-normal">Productos</th><th className="py-3 pr-4 font-normal">Estado</th><th className="py-3 text-right font-normal">Total</th></tr></thead>
            <tbody>
              {(orders.data ?? []).map((o) => (
                <tr key={o.id} className="border-b border-line-dark align-top">
                  <td className="py-3 pr-4 tnum text-slate">{dt.format(new Date(o.created_at))}</td>
                  <td className="py-3 pr-4 font-medium">{o.reference}{o.mode === "demo" && <span className="ml-2 rounded-full bg-mist px-2 py-0.5 t-small text-slate">prueba</span>}</td>
                  <td className="py-3 pr-4">{o.customer_name}<br /><span className="t-small text-slate">{o.email}</span></td>
                  <td className="py-3 pr-4 t-small">{(o.order_items as { name: string; qty: number }[]).map((i) => `${i.qty}× ${i.name}`).join(", ")}</td>
                  <td className="py-3 pr-4">{statusLabel[o.status] ?? o.status}</td>
                  <td className="py-3 text-right tnum">{formatPrice(o.total_cents)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Mensajes de contacto" empty={!leads.data?.length} emptyText="Sin mensajes todavía.">
        <ul className="divide-y divide-line-dark border-y border-line-dark">
          {(leads.data ?? []).map((l) => (
            <li key={l.id} className={l.handled_at ? "py-5 opacity-50" : "py-5"}>
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="font-medium">{l.name}{l.company && <span className="text-slate"> · {l.company}</span>} <span className="ml-2 rounded-full bg-mist px-2 py-0.5 t-small text-slate">{l.topic}</span></p>
                <p className="t-small text-slate tnum">{dt.format(new Date(l.created_at))}</p>
              </div>
              <p className="mt-2 max-w-[80ch] whitespace-pre-line text-slate">{l.message}</p>
              <div className="mt-3 flex flex-wrap items-center gap-5 t-small">
                <a href={`mailto:${l.email}?subject=${encodeURIComponent("Re: tu mensaje a ACM Motorsport")}`} className="underline underline-offset-4">Responder a {l.email}</a>
                <form action={toggleLeadHandled}>
                  <input type="hidden" name="id" value={l.id} />
                  <input type="hidden" name="handled" value={l.handled_at ? "1" : "0"} />
                  <button className="underline underline-offset-4 text-slate hover:text-ink">{l.handled_at ? "Marcar como pendiente" : "Marcar como atendido"}</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <div className="grid gap-x-16 lg:grid-cols-2">
        <Section title="Afiliados (30 días)" empty={false} emptyText="">
          <dl className="border-t border-line-dark">
            {affiliates.map((a) => (
              <div key={a.id} className="flex justify-between border-b border-line-dark py-3"><dt>{a.name}</dt><dd className="tnum font-medium">{clicksBy.get(a.id) ?? 0} {clicksBy.get(a.id) === 1 ? "clic" : "clics"}</dd></div>
            ))}
          </dl>
          {topPages.length > 0 && (
            <>
              <p className="mt-6 t-small text-slate">Páginas que más clics llevan</p>
              <ol className="mt-2 space-y-1 t-small">{topPages.map(([p, n]) => <li key={p} className="flex justify-between gap-4"><span className="truncate">{p}</span><span className="tnum">{n}</span></li>)}</ol>
            </>
          )}
        </Section>

        <Section title="Últimos suscriptores" empty={!subs.data?.length} emptyText="Nadie todavía.">
          <ul className="border-t border-line-dark">
            {(subs.data ?? []).map((s) => (
              <li key={s.email} className="flex justify-between gap-4 border-b border-line-dark py-3">
                <span className="truncate">{s.email}</span>
                <span className="shrink-0 t-small text-slate tnum">{dt.format(new Date(s.consent_at))}{s.source ? ` · ${s.source}` : ""}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </Container>
  );
}

function Stat({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div className="bg-paper p-5 sm:p-6">
      <dt className="t-small text-slate">{label}</dt>
      <dd className="t-display mt-2 tnum">{value}</dd>
      {hint && <dd className="t-small text-slate">{hint}</dd>}
    </div>
  );
}

function Section({ title, empty, emptyText, children }: { title: string; empty: boolean; emptyText: string; children: React.ReactNode }) {
  return (
    <section className="mt-16">
      <h2 className="t-title">{title}</h2>
      <div className="mt-6">{empty ? <p className="text-slate">{emptyText}</p> : children}</div>
    </section>
  );
}

/** Fecha de hace N días en ISO (fuera del componente: es una consulta por petición, no estado de render). */
function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400_000).toISOString();
}
