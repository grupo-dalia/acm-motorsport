import { shippingZones, countryNames, type ShippingZone } from "@/content/shipping";

/** Zona a la que pertenece una dirección (activa o no). Las zonas por código postal ganan a las de país. */
export function zoneFor(country: string, postalCode = "", zones: ShippingZone[] = shippingZones): ShippingZone | null {
  const cc = country.toUpperCase();
  const cp = postalCode.trim();
  const byPostal = zones.find((z) => z.postalPrefixes && Array.isArray(z.countries) && z.countries.includes(cc) && z.postalPrefixes.some((p) => cp.startsWith(p)));
  if (byPostal) return byPostal;
  const byCountry = zones.find((z) => !z.postalPrefixes && Array.isArray(z.countries) && z.countries.includes(cc));
  if (byCountry) return byCountry;
  return zones.find((z) => z.countries === "*") ?? null;
}

/** Zona activa para una dirección, o null si ahí no vendemos todavía. */
export function activeZoneFor(country: string, postalCode = "", zones: ShippingZone[] = shippingZones): ShippingZone | null {
  const z = zoneFor(country, postalCode, zones);
  return z?.active ? z : null;
}

/** Países que se pueden elegir en el checkout (con la zona "*" activa, todos los de la lista de nombres). */
export function activeCountries(zones: ShippingZone[] = shippingZones): { code: string; name: string }[] {
  const active = zones.filter((z) => z.active);
  const codes = active.some((z) => z.countries === "*") ? Object.keys(countryNames) : [...new Set(active.flatMap((z) => (Array.isArray(z.countries) ? z.countries : [])))];
  return codes.map((code) => ({ code, name: countryNames[code] ?? code })).sort((a, b) => (a.code === "ES" ? -1 : b.code === "ES" ? 1 : a.name.localeCompare(b.name, "es")));
}

/** Texto para el selector de país: en España se aclara qué parte cubrimos. */
export function countryLabel(code: string, zones: ShippingZone[] = shippingZones): string {
  if (code !== "ES") return countryNames[code] ?? code;
  const islands = zones.find((z) => z.id === "ES-islas");
  return islands?.active ? "España" : "España (península y Baleares)";
}

/** La zona de España peninsular: es la base de las reglas de envío de la tienda. */
export function homeZone(zones: ShippingZone[] = shippingZones) {
  const z = zones.find((x) => x.id === "ES");
  if (!z || z.rate.type !== "flat") throw new Error("La zona ES debe existir y tener tarifa fija");
  return { ...z, rate: z.rate };
}

/** Envío con tarifa fija. Para zonas con tarifa de Printful, el importe se calcula en el servidor al crear el pedido. */
export function flatShippingCents(zone: ShippingZone, merchandiseCents: number, hasLines: boolean): number | null {
  if (zone.rate.type !== "flat") return null;
  if (!hasLines) return 0;
  const { flatCents, freeFromCents } = zone.rate;
  return freeFromCents !== null && merchandiseCents >= freeFromCents ? 0 : flatCents;
}

/** Precio sin IVA español a partir del precio con IVA (para zonas exentas). */
export function withoutVat(cents: number, vatRate = 0.21): number {
  return Math.round(cents / (1 + vatRate));
}

/** Validación de código postal por país. España: 5 cifras de una provincia real (01-52). */
export function isValidPostalCode(country: string, postalCode: string): boolean {
  const cp = postalCode.trim();
  switch (country.toUpperCase()) {
    case "ES":
      return /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(cp);
    case "PT":
      return /^\d{4}-?\d{3}$/.test(cp);
    default:
      return cp.length >= 2 && cp.length <= 12;
  }
}

/** "España peninsular y Baleares." (o la lista de zonas activas). */
export function activeZonesSummary(zones: ShippingZone[] = shippingZones): string {
  const labels = zones.filter((z) => z.active).map((z) => z.label);
  if (labels.length <= 1) return `${labels[0] ?? "Sin envíos activos"}.`;
  return `${labels.slice(0, -1).join(", ")} y ${labels.at(-1)}.`;
}

/** Hay alguna zona activa en la que el cliente paga aranceles al recibir (fuera de la UE). */
export function anyActiveDutiesZone(zones: ShippingZone[] = shippingZones): boolean {
  return zones.some((z) => z.active && z.dutiesNotice);
}
