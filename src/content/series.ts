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
    // Vídeos exactos de la lista "OBJETIVO DAKAR TEMPORADA 1"
    pilot: {
      youtubeId: "m_1x98bgchI",
      title: "Me ghostearon después de prometerme 6.000 €",
      synopsis: "Me prometieron 6.000 € para correr el CERTT 2025 y desaparecieron. La historia completa de por qué perdí la temporada y cómo empieza todo.",
    },
    episodes: {
      1: { youtubeId: "QQJvq4OI-Iw", synopsis: "Busco copiloto para 2026. Tres copilotos profesionales explican las seis claves para sentarse a la derecha." },
      2: { youtubeId: "Et2GY7dN76c", synopsis: "Seis meses de abandono, barro de la DANA y una ventanilla rota: limpiar el Pajero a fondo para ver en qué estado está de verdad." },
      3: { youtubeId: "an6FVcES6_o", synopsis: "El calendario oficial de la Off-Road Classic 2026 y la realidad: ahora mismo el Pajero no es legal para competir." },
      4: { youtubeId: "Ac1pLobeE4w", synopsis: "A diez días del Rally de La Garrotxa: la ITV me echa, las ratas se han comido los cables y toca soldar contrarreloj." },
      5: { youtubeId: "_vlXff3ALLc", synopsis: "Debut en el Rally de La Garrotxa, primera prueba de la Off-Road Classic Cup. 1.000 km sin dormir y puesto 22." },
      6: { youtubeId: "xJ8g1Qms29E", synopsis: "770 km hasta Salou para entrenar regularidad y roadbook con Luis Graciet de copiloto. El fin de semana se complica y el Pajero vuelve roto." },
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
