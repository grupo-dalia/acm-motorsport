import data from "@/content/recambios-e4x.json";

/**
 * Recambios del patrocinador (Euro4x4parts) para los coches de nuestros manuales.
 * Los datos salen de sus fichas públicas; la compra se hace en su tienda.
 * Cuando haya feed o API de Euro4x4parts, este archivo se genera solo.
 */

export type PartBrand = { slug: string; name: string; logo: string };
export type PartVehicle = { slug: string; brand: string; name: string; engine: string; manual?: string; catalog: string };
export type PartCategory = { slug: string; name: string; manualPart?: string };
export type SparePart = { vehicle: string; category: string; ref: string; name: string; maker?: string; price?: number; img?: string; oe?: string[]; url: string };

export const partBrands: PartBrand[] = [
  { slug: "mitsubishi", name: "Mitsubishi", logo: "/marcas/mitsubishi.svg" },
  { slug: "lada", name: "Lada", logo: "/marcas/lada.svg" },
];

const R = "https://www.euro4x4parts.com/es/recambios/catalogo-especifico/";
export const partVehicles: PartVehicle[] = [
  { slug: "pajero-iii", brand: "mitsubishi", name: "Pajero III (2000-2007)", engine: "2.5 TDiC 4D56", manual: "/guias/manual-pajero-iii", catalog: R + "mitsubishi-pajero-3-montero-shogun-2000-2007-2-5-tdic-diesel-v74w-largo-2001" },
  { slug: "pajero-i", brand: "mitsubishi", name: "Pajero I (1983-1991)", engine: "2.5 TD 4D56 (L049)", catalog: R + "mitsubishi-pajero-1-montero-shogun-1983-1991-2-5-td-tdic-diesel-l049-largo-1983-1991" },
  { slug: "lada-niva", brand: "lada", name: "Niva 2121", engine: "1.6 gasolina", manual: "/guias/manual-lada-niva", catalog: R + "lada-niva-2121-1977-1-6-gasolina-76-cv-1985-1994" },
];

export const partCategories: PartCategory[] = [
  { slug: "distribucion", name: "Kits de distribución", manualPart: "distribucion" },
  { slug: "bomba-agua", name: "Bombas de agua", manualPart: "refrigeracion" },
  { slug: "correa-accesorios", name: "Correas poly-V", manualPart: "correa-auxiliar" },
  { slug: "correa-trapezoidal", name: "Correas trapezoidales", manualPart: "correa-auxiliar" },
  { slug: "filtro-aceite", name: "Filtros de aceite", manualPart: "aceite" },
  { slug: "filtro-gasoil", name: "Filtros de gasoil", manualPart: "gasoil" },
  { slug: "filtro-gasolina", name: "Filtros de gasolina" },
  { slug: "filtro-aire", name: "Filtros de aire", manualPart: "turbo" },
  { slug: "pastillas", name: "Pastillas de freno", manualPart: "frenos" },
  { slug: "discos", name: "Discos de freno", manualPart: "frenos" },
  { slug: "embrague", name: "Embrague", manualPart: "embrague" },
  { slug: "calentadores", name: "Calentadores", manualPart: "calentadores" },
  { slug: "bujias", name: "Bujías" },
  { slug: "junta-tapon", name: "Juntas del tapón de vaciado", manualPart: "aceite" },
];

export const spareParts = data as SparePart[];

export const partsFor = (vehicle: string, manualPart?: string) =>
  spareParts.filter((p) => p.vehicle === vehicle && (!manualPart || partCategories.find((c) => c.slug === p.category)?.manualPart === manualPart));
