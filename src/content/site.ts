/**
 * Configuración editorial central. Todo el texto "de marca" vive aquí o en /content
 * para poder migrarlo a Supabase/CMS en la Fase 3 sin tocar componentes.
 */
export const site = {
  name: "ACM Motorsport",
  legalOwner: "Andrés Cubero Moreno",
  founder: "Andrés Cubero Moreno",
  handle: "@andrescuberomoreno",
  tagline: "No es solo motor. Es una forma de vivir.",
  description:
    "Plataforma oficial de ACM Motorsport: el proyecto de rally todoterreno de Andrés Cubero Moreno con un Mitsubishi Pajero MK1 de 1989, la serie documental Objetivo Dakar, ACM Workshop, ACM Sim Racing y la tienda oficial.",
  locale: "es_ES",
  email: "hola@example.com", // TODO: sustituir por el correo real de contacto
  // Verificar URLs antes de producción
  social: [
    { label: "Instagram", href: "https://www.instagram.com/andrescuberomoreno/" },
    { label: "TikTok", href: "https://www.tiktok.com/@andrescuberomoreno" },
    { label: "YouTube", href: "https://www.youtube.com/@andrescuberomoreno" }
  ],
} as const;

export type NavItem = { label: string; href: string; description?: string };

export const mainNav: NavItem[] = [
  { label: "Motorsport", href: "/motorsport", description: "Equipo, piloto y Pajero MK1" },
  { label: "Objetivo Dakar", href: "/objetivo-dakar", description: "La serie documental" },
  { label: "Workshop", href: "/workshop", description: "Mecánica, fabricación y proyectos" },
  { label: "Sim Racing", href: "/sim-racing", description: "Cockpit, equipo y directos" },
  { label: "Noticias", href: "/noticias", description: "Crónicas y guías" },
  { label: "Tienda", href: "/tienda", description: "Merchandising oficial" },
];

export const legalNav: NavItem[] = [
  { label: "Aviso legal", href: "/legal/aviso-legal" },
  { label: "Privacidad", href: "/legal/privacidad" },
  { label: "Cookies", href: "/legal/cookies" },
  { label: "Condiciones de contratación", href: "/legal/condiciones" },
  { label: "Envíos", href: "/legal/envios" },
  { label: "Devoluciones", href: "/legal/devoluciones" },
  { label: "IVA y precios", href: "/legal/iva-y-precios" },
];

/** Submarcas del ecosistema ACM */
export const brands = [
  { id: "motorsport", name: "ACM Motorsport", role: "Competición", href: "/motorsport" },
  { id: "workshop", name: "ACM Workshop", role: "Mecánica, fabricación y proyectos", href: "/workshop" },
  { id: "simracing", name: "ACM Sim Racing", role: "Simulación", href: "/sim-racing" },
  { id: "dakar", name: "Objetivo Dakar", role: "Serie documental y proyecto deportivo", href: "/objetivo-dakar" },
] as const;
