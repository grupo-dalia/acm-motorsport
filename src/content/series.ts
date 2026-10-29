/**
 * Objetivo Dakar como serie: temporadas y capítulos.
 *
 * Los capítulos publicados se enlazan solos con los vídeos del canal (por número en el título
 * —"T1E3", "Ep. 3", "Capítulo 3"— o por orden de publicación). Para fijar uno a mano, rellena
 * `episodes[n]` con su `youtubeId` y, si quieres, título y sinopsis propios.
 */
export type EpisodeOverride = {
  youtubeId?: string;
  /** Palabras que identifican el vídeo en el título de YouTube (sin acentos, minúsculas). */
  match?: string[];
  title?: string;
  synopsis?: string;
  duration?: string;
};

export type SeasonConfig = {
  number: number;
  year: number;
  title: string;
  synopsis: string;
  status: "emision" | "proximamente";
  totalEpisodes: number;
  /** Capítulo piloto (número 0): por defecto, el vídeo de la lista publicado antes del capítulo 1. */
  pilot?: EpisodeOverride | null;
  /** Capítulos ya publicados (los siguientes salen como "Próximamente"). */
  releasedThrough: number;
  episodes: Record<number, EpisodeOverride>;
};

export const seasons: SeasonConfig[] = [
  {
    number: 1,
    year: 2026,
    title: "La base",
    synopsis: "Primera temporada completa con el Pajero de 1989: regularidad, un tripmaster hecho en el taller, Starlink en el techo y la Offroad Classic Cup.",
    status: "emision",
    totalEpisodes: 10,
    releasedThrough: 6,
    pilot: { match: ["6000", "patrocinio"] },
    // Datos de los guiones de Drive. 2 y 4: pendientes de confirmar título/enlace.
    episodes: {
      1: {
        match: ["copiloto"],
        title: "¿Tienes lo que hace falta para ser copiloto?",
        synopsis: "Tres copilotos con experiencia real en Dakar, CERTT y regularidad explican qué hace falta para sentarse a la derecha. Y sí, seguimos buscando copiloto.",
      },
      3: {
        match: ["calendario", "no puedo correr"],
        title: "Tengo el calendario 2026… pero ahora mismo no puedo correr",
        synopsis: "Cinco raids cerrados para la Off-Road Classic Cup y un Pajero que todavía no puede correr ninguno. Lo que hay que arreglar antes de la primera salida.",
      },
      5: { match: ["garrotxa"] },
      6: {
        match: ["salou"],
        title: "Rally Salou",
        synopsis: "Segunda prueba de la Off-Road Classic Cup. Onboard, errores, sustos y lo aprendido desde la primera carrera.",
      },
    },
  },
  {
    number: 2,
    year: 2027,
    title: "Salto internacional",
    synopsis: "CERTT y Rallye du Maroc: el nivel sube y llega la primera arena africana.",
    status: "proximamente",
    totalEpisodes: 0,
    releasedThrough: 0,
    episodes: {},
  },
  {
    number: 3,
    year: 2028,
    title: "Dakar",
    synopsis: "Arabia Saudí. La carrera que da nombre a todo el proyecto.",
    status: "proximamente",
    totalEpisodes: 0,
    releasedThrough: 0,
    episodes: {},
  },
];
