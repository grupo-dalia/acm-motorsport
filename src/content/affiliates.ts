/**
 * Enlaces de afiliación y referidos. Todos salen por /go/<id> para poder medir clics
 * y cambiar el destino sin tocar los artículos. `url: null` = pendiente: se muestra sin enlace.
 *
 * Divulgación obligatoria: cada bloque muestra que el enlace es de afiliado/referido.
 */
export type Affiliate = {
  id: string;
  name: string;
  partner: string;
  pitch: string;
  reward: string; // qué gana ACM, en lenguaje claro (uso interno / transparencia)
  url: string | null;
  code?: string;
  cta: string;
};

export const affiliates: Affiliate[] = [
  {
    id: "starlink",
    name: "Starlink",
    partner: "Starlink",
    pitch: "La antena que llevamos en el techo del Pajero. Con nuestro enlace de referido, tú también tienes recompensa al darte de alta.",
    reward: "Programa de referidos de Starlink (crédito o pago según país y tarifa).",
    url: null, // TODO: pegar el enlace de referido de la cuenta de Starlink de Andrés
    cta: "Ver Starlink con nuestro enlace",
  },
  {
    id: "euro4x4parts",
    name: "Euro4x4parts",
    partner: "Euro4x4parts",
    pitch: "Recambios y equipamiento 4x4 del patrocinador principal del equipo. Usa el código al pagar.",
    reward: "Patrocinio y código de descuento.",
    url: "https://www.euro4x4parts.com",
    code: "CUBERO",
    cta: "Ir a Euro4x4parts",
  },
  {
    id: "fullcarx",
    name: "Full Carx",
    partner: "Full Carx",
    pitch: "Los productos de limpieza y detailing que usamos con el Pajero en el capítulo 2. 10 % de descuento con nuestro código.",
    reward: "Código de descuento del canal.",
    url: "https://fullcarx.com",
    code: "CUBERO",
    cta: "Ir a Full Carx",
  },
];

export const affiliateById = (id: string) => affiliates.find((a) => a.id === id) ?? null;
