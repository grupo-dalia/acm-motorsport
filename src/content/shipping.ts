/**
 * Zonas de envío de la tienda. Printful envía a todo el mundo: el límite lo pone la web.
 *
 * Para abrir una zona basta con poner `active: true`. Antes de hacerlo:
 *  - ES-islas, LATAM y resto: que Andrés valide el IVA con su gestor (ver `vat`).
 *  - LATAM: rellenar los precios en USD (src/content/prices-usd.ts). Hasta entonces el checkout cobra en EUR.
 *  - UE: vigilar el umbral de 10.000 €/año de ventas a otros países de la UE (régimen OSS).
 *
 * `rate`:
 *  - { type: "flat" }: tarifa fija nuestra (la de España, que ya cubre lo que cobra Printful).
 *  - { type: "printful" }: se pide la tarifa real a la API de Printful en el checkout, más un margen.
 *
 * `vat`:
 *  - "included": precio con IVA español incluido (España peninsular y Baleares, y UE mientras no se pase el umbral OSS).
 *  - "exempt": sin IVA español; el cliente ve la base imponible. Canarias, Ceuta y Melilla (allí se paga IGIC/IPSI
 *    en la importación) y exportaciones fuera de la UE.
 */
export type ZoneId = "ES" | "ES-islas" | "UE" | "LATAM" | "resto";

export type ShippingZone = {
  id: ZoneId;
  active: boolean;
  label: string;
  /** Códigos ISO 3166-1 alfa-2. "*" = cualquier país que no esté en otra zona. */
  countries: string[] | "*";
  /** Solo para zonas que se distinguen por código postal dentro de un país (Canarias, Ceuta, Melilla). */
  postalPrefixes?: string[];
  currency: "EUR" | "USD";
  vat: "included" | "exempt";
  /** Aviso de aranceles e impuestos de importación (fuera de la UE). */
  dutiesNotice: boolean;
  rate: { type: "flat"; flatCents: number; freeFromCents: number | null } | { type: "printful"; marginCents: number };
};

export const EU_COUNTRIES = ["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "SE"];
export const LATAM_COUNTRIES = ["MX", "AR", "CL", "CO", "PE", "UY", "PY", "BO", "EC", "VE", "CR", "PA", "GT", "HN", "SV", "NI", "DO", "PR"];

/** Prefijos de código postal: 35 Las Palmas, 38 Santa Cruz de Tenerife, 51 Ceuta, 52 Melilla. */
export const ES_ISLANDS_POSTAL_PREFIXES = ["35", "38", "51", "52"];

export const shippingZones: ShippingZone[] = [
  { id: "ES", active: true, label: "España peninsular y Baleares", countries: ["ES"], currency: "EUR", vat: "included", dutiesNotice: false, rate: { type: "flat", flatCents: 495, freeFromCents: 6000 } },
  { id: "ES-islas", active: false, label: "Canarias, Ceuta y Melilla", countries: ["ES"], postalPrefixes: ES_ISLANDS_POSTAL_PREFIXES, currency: "EUR", vat: "exempt", dutiesNotice: true, rate: { type: "printful", marginCents: 100 } },
  { id: "UE", active: false, label: "Unión Europea", countries: EU_COUNTRIES, currency: "EUR", vat: "included", dutiesNotice: false, rate: { type: "printful", marginCents: 100 } },
  { id: "LATAM", active: false, label: "Latinoamérica", countries: LATAM_COUNTRIES, currency: "USD", vat: "exempt", dutiesNotice: true, rate: { type: "printful", marginCents: 100 } },
  { id: "resto", active: false, label: "Resto del mundo", countries: "*", currency: "EUR", vat: "exempt", dutiesNotice: true, rate: { type: "printful", marginCents: 100 } },
];

/** Nombres de países para el selector del checkout (solo hace falta tener los de zonas activas). */
export const countryNames: Record<string, string> = {
  ES: "España", PT: "Portugal", FR: "Francia", DE: "Alemania", IT: "Italia", NL: "Países Bajos", BE: "Bélgica", AT: "Austria", IE: "Irlanda",
  MX: "México", AR: "Argentina", CL: "Chile", CO: "Colombia", PE: "Perú", UY: "Uruguay", PY: "Paraguay", BO: "Bolivia", EC: "Ecuador", VE: "Venezuela",
  CR: "Costa Rica", PA: "Panamá", GT: "Guatemala", HN: "Honduras", SV: "El Salvador", NI: "Nicaragua", DO: "República Dominicana", PR: "Puerto Rico",
};

export const DUTIES_NOTICE = "Los aranceles e impuestos de importación los paga el cliente al recibir el pedido.";
