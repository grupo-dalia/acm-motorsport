import { ShoppingCart } from "lucide-react";
import type { SparePart } from "@/content/recambios";

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

/** Ficha de un recambio de Euro4x4parts: miniatura, referencia, precio y compra en su tienda. */
export function SparePartCard({ part, dark = false }: { part: SparePart; dark?: boolean }) {
  return (
    <article className={dark ? "min-w-0 rounded-[6px] border border-line p-3" : "min-w-0 rounded-[6px] border border-line-dark p-3"}>
      <a href={part.url} rel="sponsored noopener" target="_blank" className="block no-underline">
        <div className="grid aspect-square place-items-center overflow-hidden rounded-[4px] bg-white">
          {part.img ? (
            // eslint-disable-next-line @next/next/no-img-element -- imagen servida por el CDN de Euro4x4parts
            <img src={part.img} alt={part.name} loading="lazy" className="size-full object-contain p-2" />
          ) : (
            <span className="t-small text-slate">Sin foto</span>
          )}
        </div>
        <p className="mt-3 font-medium leading-tight">{part.name}</p>
        <p className="t-small mt-1 opacity-60">
          Ref. {part.ref}
          {part.maker && ` · ${part.maker}`}
        </p>
        {part.oe && <p className="t-small mt-0.5 truncate opacity-50" title={part.oe.join(", ")}>OE {part.oe.join(" · ")}</p>}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="tnum font-semibold">{part.price ? eur.format(part.price) : "Ver precio"}</span>
          <span className="inline-flex h-9 items-center gap-1.5 rounded-[var(--radius-btn)] bg-racing px-3 text-sm font-medium text-paper">
            <ShoppingCart aria-hidden className="size-4" /> Comprar
          </span>
        </div>
      </a>
    </article>
  );
}
