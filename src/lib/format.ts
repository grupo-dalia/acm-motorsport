const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

/** Todos los importes del dominio van en céntimos (enteros) para evitar errores de coma flotante. */
export function formatPrice(cents: number) {
  return eur.format(cents / 100);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat("es-ES", opts).format(new Date(iso));
}

const compact = new Intl.NumberFormat("es-ES", { notation: "compact", maximumFractionDigits: 1 });

export function formatViews(n: number | null) {
  if (n === null) return null;
  return `${n < 10000 ? n.toLocaleString("es-ES") : compact.format(n)} ${n === 1 ? "visualización" : "visualizaciones"}`;
}

const rtf = new Intl.RelativeTimeFormat("es-ES", { numeric: "auto" });

export function timeAgo(iso: string, now = Date.now()) {
  if (!iso) return null;
  const s = (new Date(iso).getTime() - now) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
  for (const [u, sec] of units) if (Math.abs(s) >= sec) return rtf.format(Math.round(s / sec), u);
  return "ahora mismo";
}
