import Link from "next/link";
import localFont from "next/font/local";
import { activeCampaign, christmas } from "@/content/pricing";
import { promoShirts } from "@/content/promo";
import { catalog } from "@/integrations/commerce";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import s from "./promo-banner.module.css";

const barlow = localFont({
  src: [
    { path: "../../fonts/barlow-condensed-latin-800-italic.woff2", weight: "800", style: "italic" },
    { path: "../../fonts/barlow-condensed-latin-900-italic.woff2", weight: "900", style: "italic" },
  ],
  variable: "--font-barlow-c",
  display: "swap",
});

type Copy = { kicker: string; l1: string; l2: string; lead: string };

/** Qué dice el banner según la fecha: Black Friday → Navidad → colección. */
function copyFor(now = new Date()): Copy {
  const c = activeCampaign(now);
  if (c) return { kicker: c.label.replace(/\s*−?\d+ ?%/, "").trim() || "Oferta", l1: `−${c.percent} % en`, l2: "toda la tienda", lead: "Hasta el lunes 30 de noviembre. Camisetas de rally y motor, hechas una a una bajo pedido." };
  if (now >= new Date(christmas.from) && now <= new Date(christmas.orderBy)) return { kicker: "Navidad", l1: "Regala", l2: "rally", lead: "Pide antes del 10 de diciembre y lo tienes en casa para Navidad." };
  return { kicker: "Nueva colección", l1: "Hecha", l2: "para correr", lead: "Camisetas de rally y motor, diseñadas por ACM e impresas una a una bajo pedido." };
}

/** Banner animado (solo CSS): apaisado en ordenador, en vertical en el móvil. */
export async function PromoBanner({ variant = "full", className }: { variant?: "full" | "slim"; className?: string }) {
  const products = await catalog.listProducts();
  const [front, back] = promoShirts;
  if (!front) return null;
  const p = products.find((x) => x.slug === front.slug);
  const copy = copyFor();
  return (
    <Link href="/tienda" className={cn(s.banner, variant === "slim" && s.slim, barlow.variable, className)} aria-label={`${copy.kicker}: ${copy.l1} ${copy.l2}. Ir a la tienda`}>
      <span className={s.stripe} aria-hidden />
      <div className={s.copy}>
        <span className={s.kicker}>{copy.kicker}</span>
        <p className={s.title}>
          <span>{copy.l1}</span>
          <span>{copy.l2}</span>
        </p>
        <span className={s.bars} aria-hidden><i /><i /><i /></span>
        <p className={s.lead}>{copy.lead}</p>
        {p && (
          <p className={s.price}>
            {p.compareAtCents ? <s>{formatPrice(p.compareAtCents)}</s> : null}
            <b>{p.compareAtCents ? "" : "desde "}{formatPrice(p.priceCents)}</b>
          </p>
        )}
        <span className={s.cta}>Ver la tienda →</span>
      </div>
      <div className={s.stage} aria-hidden>
        {back && (
          // eslint-disable-next-line @next/next/no-img-element -- recortes ligeros en webp, ya a su tamaño
          <img src={back.images[0]} alt="" className={cn(s.shirt, s.back)} loading="lazy" />
        )}
        <div className={s.cycle}>
          {front.images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- ídem
            <img key={src} src={src} alt="" className={cn(s.shirt, s.front)} loading={i === 0 ? "eager" : "lazy"} style={{ animationDelay: `${i * 2}s, ${-i * 0.6}s` }} />
          ))}
        </div>
        {front.images.length > 1 && <span className={s.tag}>{front.images.length} colores</span>}
        <span className={s.plate}>
          {front.name}
          <small>Camiseta · unisex</small>
        </span>
      </div>
    </Link>
  );
}
