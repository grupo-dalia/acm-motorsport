import type { CategorySlug } from "@/domain/catalog";

/**
 * Política de precios de la tienda.
 *
 * 1) Precio mínimo por categoría (IVA incluido). Si en Printful pones menos, la web usa este mínimo,
 *    para que ninguna prenda se venda perdiendo dinero. Si pones más, manda tu precio.
 *    Cuentas en la hoja "Tienda ACM: costes, precios y margen".
 * 2) Campañas: rebaja automática en toda la tienda entre dos fechas, con el precio antiguo tachado.
 * 3) Aviso de Navidad: fecha límite para pedir y que llegue a tiempo.
 */

export const priceFloorCents: Partial<Record<CategorySlug, number>> = {
  camisetas: 2495,
  sudaderas: 4495,
  gorras: 2295,
  accesorios: 1995,
  pegatinas: 495,
};

export type Campaign = {
  id: string;
  /** Texto corto de la etiqueta en las fichas. */
  label: string;
  /** Frase de la barra superior. */
  banner: string;
  percent: number;
  /** Fechas en hora de Madrid, inclusive. */
  from: string;
  to: string;
};

export const campaigns: Campaign[] = [
  {
    id: "black-friday-2026",
    label: "Black Friday −20 %",
    banner: "Black Friday: −20 % en toda la tienda hasta el lunes 30 de noviembre",
    percent: 20,
    from: "2026-11-20T00:00:00+01:00",
    to: "2026-11-30T23:59:59+01:00",
  },
];

/** Último día para pedir con envío estándar y recibir antes de Navidad (España). Ajustar con el calendario de Printful. */
export const christmas = {
  orderBy: "2026-12-10T23:59:59+01:00",
  from: "2026-12-01T00:00:00+01:00",
  banner: "Pide antes del 10 de diciembre y lo tienes en casa para Navidad",
  late: "Los pedidos desde el 11 de diciembre pueden llegar después de Navidad",
  lateUntil: "2026-12-24T23:59:59+01:00",
};

export function activeCampaign(now = new Date()): Campaign | null {
  return campaigns.find((c) => now >= new Date(c.from) && now <= new Date(c.to)) ?? null;
}

/** Mensaje de la barra superior según la fecha: campaña > aviso de Navidad > nada. */
export function announcement(now = new Date()): string | null {
  const c = activeCampaign(now);
  if (c) return c.banner;
  if (now >= new Date(christmas.from) && now <= new Date(christmas.orderBy)) return christmas.banner;
  if (now > new Date(christmas.orderBy) && now <= new Date(christmas.lateUntil)) return christmas.late;
  return null;
}

/** Redondea al precio psicológico .95 más cercano por debajo (19,96 → 19,95). */
const to95 = (cents: number) => Math.max(95, Math.floor((cents + 5) / 100) * 100 - 5);

/** Precio final de una variante: aplica el mínimo y, si hay campaña, la rebaja. */
export function applyPricing(category: CategorySlug, retailCents: number, now = new Date()): { priceCents: number; compareAtCents: number | null } {
  const base = Math.max(retailCents, priceFloorCents[category] ?? 0);
  const c = activeCampaign(now);
  if (!c || base <= 0) return { priceCents: base, compareAtCents: null };
  const sale = to95(Math.round(base * (1 - c.percent / 100)));
  return sale < base ? { priceCents: sale, compareAtCents: base } : { priceCents: base, compareAtCents: null };
}
