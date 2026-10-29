import { affiliateById } from "@/content/affiliates";

/** Bloque de afiliado dentro de un artículo. Siempre con divulgación visible. */
export function AffiliateBox({ id }: { id: string }) {
  const a = affiliateById(id);
  if (!a) return null;
  return (
    <aside className="my-10 rounded-[8px] bg-mist p-6 text-ink sm:p-8" aria-label={`Recomendación: ${a.name}`}>
      <p className="t-small text-slate">Enlace de afiliado o referido · nos ayuda a llegar al Dakar sin coste extra para ti</p>
      <p className="t-title mt-3">{a.name}</p>
      <p className="mt-2 max-w-[56ch] text-base text-slate">{a.pitch}</p>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-base">
        {a.url ? (
          <a href={`/go/${a.id}`} rel="sponsored nofollow" className="inline-flex h-12 items-center rounded-[var(--radius-btn)] bg-racing px-6 font-medium text-paper no-underline hover:bg-racing-dark">{a.cta}</a>
        ) : (
          <span className="t-small text-slate">Enlace pendiente de configurar</span>
        )}
        {a.code && <span>Código <strong className="tracking-wide">{a.code}</strong></span>}
      </div>
    </aside>
  );
}
