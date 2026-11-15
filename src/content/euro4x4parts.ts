import type { ShopLink } from "@/content/manual-types";

/**
 * Enlaces al catálogo de Euro4x4parts (patrocinador) filtrado por vehículo.
 * Su buscador solo entiende referencias, así que enlazamos a la familia de recambio del vehículo.
 */
const ROOT = "https://www.euro4x4parts.com/es/recambios/catalogo-especifico/";

/** Pajero III 2.5 TDiC (4D56). Las piezas de motor son las mismas en corto (V64) y largo (V74W). */
export const PAJERO3_25 = ROOT + "mitsubishi-pajero-3-montero-shogun-2000-2007-2-5-tdic-diesel-v74w-largo-2001";

export const pajeroShop = (path: string) => `${PAJERO3_25}/${path}`;
export const shop = (label: string, path: string): ShopLink => ({ label, url: pajeroShop(path) });

const M = "mantenimiento/";
const LIQ = M + "aceites-liquidos-aditivos-productos-de-limpieza-y-taller/";
const FIL = M + "filtracion-y-snorkels/";

/** Recambios de cada trabajo del manual del Pajero III (por id de pieza). */
export const pajeroShopByPart: Record<string, ShopLink[]> = {
  "correa-auxiliar": [shop("Correa poly-V (serpentina)", M + "correas-y-distribucion/correa-poly-v"), shop("Tensor de la correa poly-V", "motor/correas-y-distribucion/correa-poly-v-tensor"), shop("Correa trapezoidal (aire acondicionado)", M + "correas-y-distribucion/correa-trapezoidal")],
  distribucion: [shop("Kit de distribución completo", M + "correas-y-distribucion/distribucion-kit-completo"), shop("Correas de distribución sueltas", "motor/correas-y-distribucion/distribucion-correa"), shop("Tornillo de la polea del cigüeñal", "motor/correas-y-distribucion/distribucion-perno-de-ciguenal"), shop("Bomba de agua", M + "refrigeracion-calefaccion-clim/bomba-de-agua")],
  "tension-distribucion": [shop("Kit de distribución completo", M + "correas-y-distribucion/distribucion-kit-completo"), shop("Muelle del tensor", "motor/correas-y-distribucion/distribucion-muelle-de-tension")],
  valvulas: [shop("Piezas de motor (juntas, retenes…)", "motor/motores-piezas-motor")],
  "arbol-levas": [shop("Piezas de motor (retenes, juntas…)", "motor/motores-piezas-motor")],
  culata: [shop("Piezas de motor (junta de culata, tornillos…)", "motor/motores-piezas-motor")],
  aceite: [shop("Aceite de motor", LIQ + "aceite-motor"), shop("Filtro de aceite", FIL + "filtro-aceite-motor"), shop("Arandela del tapón de vaciado", FIL + "tapon-de-cambio-de-aceite-junta")],
  carter: [shop("Piezas de motor (cárter, juntas…)", "motor/motores-piezas-motor")],
  "retenes-ciguenal": [shop("Piezas de motor (retenes…)", "motor/motores-piezas-motor")],
  refrigeracion: [shop("Bomba de agua", M + "refrigeracion-calefaccion-clim/bomba-de-agua"), shop("Refrigerante", LIQ + "liquido-de-refrigeracion"), shop("Refrigeración (termostato, manguitos…)", "refrigeracion-calefaccion-electricidad/refrigeracion-calefaccion-clim")],
  gasoil: [shop("Filtro de gasoil", FIL + "filtro-gasoil"), shop("Inyección y alimentación", "motor/inyeccion-encendido-alimentacion")],
  "bomba-inyectora": [shop("Inyección y alimentación", "motor/inyeccion-encendido-alimentacion"), shop("Piñón de la bomba inyectora", "motor/correas-y-distribucion/distribucion-polea-pinon-de-bomba-de-inyeccion")],
  turbo: [shop("Inyección y alimentación", "motor/inyeccion-encendido-alimentacion"), shop("Filtro de aire", FIL + "filtro-aire")],
  calentadores: [shop("Calentadores", M + "inyeccion-encendido-alimentacion/precalentamiento-calentador"), shop("Arranque y alternador", "motor/arranque-alternador-electricidad")],
  embrague: [shop("Embrague", "motor/embrague"), shop("Líquido de frenos y embrague", LIQ + "liquido-de-freno")],
  "caja-reductora": [shop("Aceite de caja y puentes", LIQ + "aceite-caja-y-puente"), shop("Caja de transferencia", "transmision/transmision-caja-de-transferencia")],
  diferenciales: [shop("Aceite de caja y puentes", LIQ + "aceite-caja-y-puente"), shop("Puentes, rodamientos y bujes", "transmision/puentes-rodamientos-bujes-manguetas")],
  frenos: [shop("Pastillas de freno", M + "frenado-estandar/pastillas-de-freno"), shop("Discos de freno", M + "frenado-estandar/disco-de-freno"), shop("Líquido de frenos", LIQ + "liquido-de-freno")],
  direccion: [shop("Dirección y rótulas", "suspension-direccion/direccion-rotulas")],
};
