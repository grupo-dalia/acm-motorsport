const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });

/** Todos los importes del dominio van en céntimos (enteros) para evitar errores de coma flotante. */
export function formatPrice(cents: number) {
  return eur.format(cents / 100);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat("es-ES", opts).format(new Date(iso));
}
