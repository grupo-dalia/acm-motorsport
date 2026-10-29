/**
 * Contenido deportivo. Regla: aquí solo hay datos confirmados por Andrés.
 * Lo que falte se marca como `null` y la interfaz lo muestra como "Por confirmar".
 */

export type RoadmapStage = {
  year: number;
  title: string;
  events: string[];
  status: "en-curso" | "planificado" | "objetivo";
  note: string;
};

export const roadmap: RoadmapStage[] = [
  {
    year: 2026,
    title: "Base",
    events: ["Offroad Classic Cup"],
    status: "en-curso",
    note: "Primera temporada completa con el Pajero MK1. Regularidad, kilómetros y aprendizaje.",
  },
  {
    year: 2027,
    title: "Salto internacional",
    events: ["CERTT", "Rallye du Maroc"],
    status: "planificado",
    note: "Campeonato de España de Rallyes TT y la primera gran prueba africana.",
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
  { group: "Vehículo", label: "Modelo", value: "Mitsubishi Pajero MK1" },
  { group: "Vehículo", label: "Año", value: "1989" },
  { group: "Vehículo", label: "Uso", value: "Rally raid y regularidad" },
  { group: "Vehículo", label: "Motor", value: null },
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

export type CrewMember = { role: string; name: string | null; bio: string | null };

export const crew: CrewMember[] = [
  {
    role: "Piloto",
    name: "Andrés Cubero Moreno",
    bio: "Piloto de rally todoterreno, mecánico y creador de contenido. Prepara, repara y documenta el coche con el que compite.",
  },
  { role: "Copiloto", name: null, bio: null },
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
  { id: "occ-2026-garrotxa", name: "Off-Road Classic Cup · Rally de La Garrotxa", season: 2026, date: null, location: "Besalú (Girona)", status: "disputado" },
  { id: "occ-2026-salou", name: "Off-Road Classic Cup · Salou", season: 2026, date: null, location: "Salou (Tarragona)", status: "disputado" },
  { id: "certt-2027", name: "CERTT", season: 2027, date: null, location: null, status: "por-confirmar" },
  { id: "maroc-2027", name: "Rallye du Maroc", season: 2027, date: null, location: "Marruecos", status: "por-confirmar" },
  { id: "dakar-2028", name: "Dakar Rally", season: 2028, date: null, location: "Arabia Saudí", status: "por-confirmar" },
];

/** Resultados: vacío hasta que haya clasificaciones oficiales. No inventar. */
export const results: { event: string; date: string; category: string; position: string; source: string }[] = [
  // Fuente provisional: el propio capítulo. Sustituir por la clasificación oficial cuando se tenga el enlace.
  { event: "Rally de La Garrotxa · Off-Road Classic Cup", date: "2026", category: "Regularidad", position: "22.º", source: "https://www.youtube.com/watch?v=_vlXff3ALLc" },
];

export type Sponsor = {
  id: string;
  name: string;
  tier: "principal" | "oficial" | "colaborador";
  description: string;
  logo: string | null; // ruta en /public/sponsors cuando exista el archivo original
  url: string | null;
  code?: string;
};

/** Patrocinadores confirmados por Andrés. Verificar textos y URLs con cada marca antes de publicar. */
export const sponsors: Sponsor[] = [
  {
    id: "euro4x4parts",
    name: "Euro4x4parts",
    tier: "principal",
    description: "Recambios y equipamiento 4x4.",
    logo: null,
    url: null,
    code: "CUBERO",
  },
  { id: "metal-lube", name: "Metal Lube", tier: "oficial", description: "Lubricación y tratamientos.", logo: null, url: null },
  {
    id: "giants",
    name: "Giants Software · Farming Simulator 25",
    tier: "colaborador",
    description: "Colaboración en contenido de simulación.",
    logo: null,
    url: null,
  },
  // Todo Racing Store: añadir solo como "colaborador comercial autorizado" cuando exista autorización por escrito.
];
