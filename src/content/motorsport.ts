/**
 * Contenido deportivo. Regla: aquí solo hay datos confirmados por Andrés.
 * Lo que falte se marca como `null` y la interfaz lo muestra como "Por confirmar".
 */

export type RoadmapStage = {
  year: number;
  title: string;
  events: string[];
  status: "hecho" | "en-curso" | "planificado" | "objetivo";
  note: string;
};

export const roadmap: RoadmapStage[] = [
  {
    year: 2024,
    title: "Debut",
    events: ["CERTT"],
    status: "hecho",
    note: "Debut en el Campeonato de España de Rallyes TT con el Pajero: 5.º en el Rallye TT Jaén Mar de Olivos. Después, Lorca, Cierzo y Cuenca.",
  },
  {
    year: 2025,
    title: "Parón",
    events: ["Sin carreras"],
    status: "hecho",
    note: "Un año sin competir. Por qué, lo cuento en el capítulo piloto de Objetivo Dakar.",
  },
  {
    year: 2026,
    title: "Regularidad",
    events: ["Off-Road Classic Cup"],
    status: "en-curso",
    note: "La copa de regularidad sobre tierra de Classics Rent Services, en Cataluña. Cinco pruebas y un copiloto distinto en cada una.",
  },
  {
    year: 2027,
    title: "Salto internacional",
    events: ["CERTT", "Rallye du Maroc"],
    status: "planificado",
    note: "Vuelta al Campeonato de España de Rallyes TT y la primera gran prueba africana.",
  },
  {
    year: 2028,
    title: "Dakar",
    events: ["Dakar Rally"],
    status: "objetivo",
    note: "El objetivo que da nombre a todo el proyecto.",
  },
];

export type SpecRow = { label: string; value: string | null; group: "Vehículo" | "Electrónica" | "Preparación" };

/** Ficha técnica editable. `null` = pendiente de confirmar por el equipo. */
export const vehicleSpecs: SpecRow[] = [
  { group: "Vehículo", label: "Modelo", value: "Mitsubishi Pajero MK1 (L049)" },
  { group: "Vehículo", label: "Carrocería", value: "Batalla larga, 5 puertas" },
  { group: "Vehículo", label: "Año", value: "1989" },
  { group: "Vehículo", label: "Uso", value: "Rally raid y regularidad" },
  { group: "Vehículo", label: "Motor", value: "4D56 · 2.5 turbodiésel" },
  { group: "Vehículo", label: "Transmisión", value: null },
  { group: "Vehículo", label: "Peso en orden de marcha", value: null },
  { group: "Preparación", label: "Suspensión", value: null },
  { group: "Preparación", label: "Neumáticos", value: null },
  { group: "Preparación", label: "Seguridad (arco, baquets, arneses)", value: null },
  { group: "Electrónica", label: "Navegación / regularidad", value: "Módulo propio: Raspberry Pi 5 + GPS RTK u-blox ZED-F9P" },
  { group: "Electrónica", label: "Sensor de rueda", value: "Efecto Hall" },
  { group: "Electrónica", label: "Pantalla", value: "Táctil 7\"" },
  { group: "Electrónica", label: "Conectividad", value: "Starlink Mini en techo" },
];

export type CrewMember = { role: string; name: string | null; bio: string | null; image?: string; imagePosition?: string };

export const crew: CrewMember[] = [
  {
    role: "Piloto",
    name: "Andrés Cubero Moreno",
    bio: "Piloto de rally todoterreno, mecánico y creador de contenido. Prepara, repara y documenta el coche con el que compite.",
    image: "/media/andres-retrato-gorra.jpg",
  },
  {
    role: "Copiloto",
    name: "Uno distinto en cada carrera",
    bio: "En 2026 el asiento de la derecha va rotando: cada prueba, alguien nuevo. En La Garrotxa fue Anaïs Soriano, que se llevó el premio a la mejor debutante. Por qué lo hago así lo cuento en el capítulo 1 de Objetivo Dakar.",
    image: "/media/anais-soriano-mejor-debutante.jpg",
    imagePosition: "50% 35%",
  },
  { role: "Asistencia", name: null, bio: null },
];

export type CalendarEvent = {
  id: string;
  name: string;
  season: number;
  date: string | null; // ISO; null = por confirmar
  location: string | null;
  status: "por-confirmar" | "confirmado" | "disputado";
};

export const calendar: CalendarEvent[] = [
  // 2024 · CERTT (Campeonato de España de Rallyes Todo Terreno). Andrés corrió Jaén, Lorca, Cierzo y Cuenca.
  { id: "certt-2024-jaen", name: "CERTT · VI Rallye TT Jaén Mar de Olivos", season: 2024, date: "2024-04-13", location: "Jaén", status: "disputado" },
  { id: "certt-2024-lorca", name: "CERTT · Baja Lorca Ciudad del Sol", season: 2024, date: "2024-05-25", location: "Lorca (Murcia)", status: "disputado" },
  { id: "certt-2024-cierzo", name: "CERTT · VI Cierzo Rally Ejército de Tierra", season: 2024, date: "2024-07-05", location: "Zaragoza", status: "disputado" },
  { id: "certt-2024-cuenca", name: "CERTT · Rallye TT Cuenca", season: 2024, date: "2024-10-04", location: "Cuenca", status: "disputado" },
  // 2026 · Off-Road Classic Cup (Classics Rent Services)
  { id: "occ-2026-garrotxa", name: "Off-Road Classic Cup · II Clàssic Raid La Garrotxa", season: 2026, date: "2026-02-21", location: "Besalú (Girona)", status: "disputado" },
  { id: "occ-2026-salou", name: "Off-Road Classic Cup · I Clàssic Raid Salou", season: 2026, date: "2026-04-11", location: "Salou (Tarragona)", status: "disputado" },
  { id: "occ-2026-selva", name: "Off-Road Classic Cup · VII Clàssic Raid La Selva", season: 2026, date: "2026-05-09", location: "Arbúcies (Girona)", status: "disputado" },
  { id: "occ-2026-emporda", name: "Off-Road Classic Cup · VII Clàssic Raid Alt Empordà", season: 2026, date: "2026-09-19", location: "Palau-saverdera (Girona)", status: "disputado" },
  { id: "occ-2026-estany", name: "Off-Road Classic Cup · VII Clàssic Raid Pla de l'Estany", season: 2026, date: "2026-11-07", location: "Cornellà del Terri (Girona)", status: "confirmado" },
  { id: "certt-2027", name: "CERTT", season: 2027, date: null, location: null, status: "por-confirmar" },
  { id: "maroc-2027", name: "Rallye du Maroc", season: 2027, date: null, location: "Marruecos", status: "por-confirmar" },
  { id: "dakar-2028", name: "Dakar Rally", season: 2028, date: null, location: "Arabia Saudí", status: "por-confirmar" },
];

/** Resultados confirmados por Andrés. `source` = enlace a la clasificación o, de momento, al capítulo. */
export const results: { event: string; date: string; category: string; position: string; source: string | null; note?: string }[] = [
  { event: "Rallye TT Jaén Mar de Olivos · CERTT", date: "2024", category: "Debut en el CERTT", position: "5.º", source: null },
  { event: "Clàssic Raid La Garrotxa · Off-Road Classic Cup", date: "2026", category: "Regularidad", position: "22.º", source: "https://www.youtube.com/watch?v=_vlXff3ALLc", note: "Anaïs Soriano, premio a la mejor debutante" },
];

export type Sponsor = {
  id: string;
  name: string;
  tier: "principal" | "oficial" | "colaborador" | "referido";
  description: string;
  /** Logo: ruta en /public/sponsors o URL de la web oficial. null = nombre en tipografía. */
  logo: string | null;
  /** Fondo de la tarjeta, para que el logo contraste. */
  tile?: "light" | "white" | "dark";
  url: string | null;
  code?: string;
  /** Texto destacado (solo el principal). */
  story?: string;
};

/** Patrocinadores confirmados por Andrés. */
export const sponsors: Sponsor[] = [
  {
    id: "euro4x4parts",
    name: "Euro4x4parts",
    tier: "principal",
    description: "Recambios y equipamiento 4x4.",
    logo: "https://cdn.euro4x4parts.com/e4xmedia/prod/images-frontend/company/euro4x4parts-blanc.svg",
    url: "https://www.euro4x4parts.com",
    code: "CUBERO",
    story: "Nos acompaña desde el minuto uno. Confió en el proyecto cuando era un Pajero de 1989 y un dorsal en Jaén, y sigue a nuestro lado en cada carrera.",
  },
  { id: "metal-lube", name: "Metal Lube", tier: "oficial", description: "Lubricación y tratamientos antifricción.", logo: "https://metallube.es/wp-content/uploads/2025/07/logo.webp", tile: "dark", url: "https://metallube.es" },
  { id: "fullcarx", name: "Full Carx", tier: "colaborador", description: "Limpieza y detailing.", logo: "https://fullcarx.com/img/logo-1741601439.jpg", tile: "white", url: "https://fullcarx.com", code: "CUBERO" },
  { id: "kingbolen", name: "Kingbolen", tier: "colaborador", description: "Nos cedió el equipo de diagnosis.", logo: "https://www.kingbolen.com/cdn/shop/files/e8fc6dfd30864aa1bb7da5787a10dd58.png?v=1742464172&width=450", tile: "white", url: "https://www.kingbolen.com" },
  {
    id: "giants",
    name: "GIANTS Software",
    tier: "colaborador",
    description: "Partner program · Farming Simulator.",
    logo: "/sponsors/giants-partner-long-black.svg",
    url: null,
  },
  // Starlink no es patrocinador: es nuestro enlace de referido. Por eso va sin logo y enlaza a /starlink.
  { id: "starlink", name: "Starlink", tier: "referido", description: "Conectividad a bordo · enlace de referido.", logo: null, url: "/starlink" },
  // Todo Racing Store: añadir solo como "colaborador comercial autorizado" cuando exista autorización por escrito.
];
