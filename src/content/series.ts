/**
 * Objetivo Dakar como serie: temporadas y capítulos.
 *
 * Los capítulos publicados se enlazan solos con los vídeos del canal (por número en el título
 * —"T1E3", "Ep. 3", "Capítulo 3"— o por orden de publicación). Para fijar uno a mano, rellena
 * `episodes[n]` con su `youtubeId` y, si quieres, título y sinopsis propios.
 */
export type EpisodeOverride = { youtubeId?: string; title?: string; synopsis?: string; duration?: string };

export type SeasonConfig = {
  number: number;
  year: number;
  title: string;
  synopsis: string;
  status: "emision" | "proximamente";
  totalEpisodes: number;
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
    releasedThrough: 7,
    episodes: {},
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
