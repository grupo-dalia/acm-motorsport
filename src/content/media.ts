/**
 * Vídeos y episodios. `youtubeId: null` = aún sin enlazar → se muestra placeholder.
 * Para enlazar un vídeo basta con pegar el ID (lo que va tras watch?v=).
 */
export type Video = {
  id: string;
  title: string;
  series: "objetivo-dakar" | "workshop" | "sim-racing" | "general";
  episode?: number;
  summary: string;
  youtubeId: string | null;
  publishedAt: string | null;
};

export const videos: Video[] = [
  {
    id: "que-es-regularidad",
    title: "Qué es un rally de regularidad",
    series: "objetivo-dakar",
    episode: 1,
    summary: "Tramos, medias impuestas y controles secretos: cómo funciona la disciplina con la que arranca el proyecto.",
    youtubeId: null,
    publishedAt: null,
  },
  {
    id: "dispositivo-regularidad",
    title: "He creado mi propio dispositivo para regularidad",
    series: "objetivo-dakar",
    episode: 2,
    summary: "Raspberry Pi 5, GPS RTK de precisión centimétrica y sensor Hall en rueda. Un tripmaster hecho en el taller.",
    youtubeId: null,
    publishedAt: null,
  },
  {
    id: "starlink-mini-instalacion",
    title: "Cómo instalar Starlink Mini en tu coche",
    series: "workshop",
    summary: "Montaje en el techo del Pajero, cableado y lo que nadie te cuenta antes de taladrar.",
    youtubeId: null,
    publishedAt: null,
  },
  {
    id: "starlink-mini-movimiento",
    title: "Starlink Mini en movimiento: prueba real",
    series: "workshop",
    summary: "Conexión en marcha por pista y carretera. Qué funciona y qué no.",
    youtubeId: null,
    publishedAt: null,
  },
];

export type WorkshopProject = {
  id: string;
  title: string;
  category: "Pajero" | "Restauración" | "Electrónica" | "Fabricación";
  status: "En curso" | "Próximamente" | "Terminado";
  summary: string;
  /** Foto en /public/media (null = marco pendiente). */
  image: string | null;
  /** Vídeo de YouTube del proyecto, si lo hay. */
  youtubeId?: string;
};

export const workshopProjects: WorkshopProject[] = [
  { id: "itv", title: "Pasar la ITV contrarreloj", category: "Pajero", status: "Terminado", summary: "Escape partido, rótula con holgura y ratas en el cableado, a diez días de La Garrotxa. Soldadura y madrugadas.", image: "/media/taller-lampara-itv.jpg", youtubeId: "Ac1pLobeE4w" },
  { id: "starlink", title: "Starlink Mini en el techo", category: "Pajero", status: "Terminado", summary: "Instalación en la parte delantera del techo, respetando el techo solar trasero, y prueba en movimiento.", image: "/media/starlink-techo.jpg", youtubeId: "3aBYyv4A7fs" },
  { id: "liberadores", title: "Liberadores AVM", category: "Pajero", status: "Terminado", summary: "Por qué reventaron en carrera, por qué no hay que usar grasa y el cambio a unos AVM.", image: "/media/liberador-avm.jpg", youtubeId: "5pOR1MZIdk0" },
  { id: "regularidad", title: "Módulo de regularidad RTK", category: "Electrónica", status: "En curso", summary: "Odómetro y navegación propios con GPS RTK, sensor Hall y pantalla táctil. En Salou vimos que necesita más precisión.", image: null },
  { id: "goteras", title: "Adiós a las goteras del techo", category: "Pajero", status: "Próximamente", summary: "Diagnóstico y sellado de las entradas de agua del Pajero.", image: null },
  { id: "salpicadero", title: "Salpicadero", category: "Pajero", status: "Próximamente", summary: "Reorganización del salpicadero para competición.", image: null },
  { id: "homocinetica", title: "Homocinética izquierda", category: "Pajero", status: "Próximamente", summary: "Sustitución de la junta homocinética delantera izquierda.", image: null },
  { id: "tractor", title: "Restauración de un tractor", category: "Restauración", status: "Próximamente", summary: "Recuperar una máquina de campo desde cero.", image: null },
  { id: "cockpit", title: "Cockpit de sim racing", category: "Fabricación", status: "Próximamente", summary: "Diseño y construcción del puesto de simulación de ACM Sim Racing.", image: null },
];
