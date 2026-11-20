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

/** Primera tarjeta: cambia sola según la fecha (Black Friday → Navidad → colección). */
function lead(now = new Date()) {
  const c = activeCampaign(now);
  if (c) return { pill: "Black Friday", title: `−${c.percent} % en todo`, text: "Hasta el lunes 30 de noviembre.", btn: "Comprar ahora" };
  if (now >= new Date(christmas.from) && now <= new Date(christmas.orderBy)) return { pill: "Navidad", title: "Regala rally", text: "Pide antes del 10 de diciembre y llega a tiempo.", btn: "Ver regalos" };
  return { pill: "Tienda ACM", title: "Hecha para correr", text: "Diseñada por el equipo, impresa bajo pedido.", btn: "Ver la tienda" };
}

/** Tarjetas de la tienda (foto, etiqueta, título y botón). En el móvil se deslizan de lado. */
export async function PromoBanner({ className, heading = true }: { className?: string; heading?: boolean; variant?: "full" | "slim" }) {
  const products = await catalog.listProducts();
  const l = lead();
  return (
    <div className={cn(s.wrap, barlow.variable, className)}>
      {heading && (
        <div className={s.head}>
          <div>
            <p className={s.eyebrow}>Tienda ACM Motorsport</p>
            <p className={s.h}>Nueva colección</p>
          </div>
          <Link href="/tienda" className={s.all}>Ver todo</Link>
        </div>
      )}
      <div className={s.row}>
        <Link href="/tienda" className={s.card}>
          {/* eslint-disable-next-line @next/next/no-img-element -- foto propia ya optimizada */}
          <img src="/promo/card-rally.webp" alt="" className={s.photo} loading="lazy" />
          <span className={cn(s.pill, s.red)}>{l.pill}</span>
          <span className={s.title}>{l.title}</span>
          <span className={s.text}>{l.text}</span>
          <span className={s.btn}>{l.btn}</span>
        </Link>
        {promoShirts.map((shirt) => {
          const p = products.find((x) => x.slug === shirt.slug);
          return (
            <Link key={shirt.slug} href={`/tienda/${shirt.slug}`} className={s.card}>
              <span className={s.stripes} aria-hidden />
              <span className={cn(s.shirts, shirt.images.length > 1 && s.cycle)} aria-hidden>
                {shirt.images.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element -- recortes webp ligeros
                  <img key={src} src={src} alt="" loading="lazy" style={shirt.images.length > 1 ? { animationDelay: `${i * 2 - 1}s` } : undefined} />
                ))}
              </span>
              <span className={s.pill}>{shirt.images.length > 1 ? `Nuevo · ${shirt.images.length} colores` : "Nuevo"}</span>
              <span className={s.title}>{shirt.name}</span>
              {p && (
                <span className={s.price}>
                  {p.compareAtCents ? <s>{formatPrice(p.compareAtCents)}</s> : null}
                  <b>{formatPrice(p.priceCents)}</b>
                </span>
              )}
              <span className={s.btn}>Ver camiseta</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
