/**
 * Configuración de YouTube. Los vídeos se leen solos del feed público del canal
 * (se refresca cada hora). Para afinar qué vídeo va a cada sección:
 *  - Pega IDs de listas de reproducción en `playlists` (lo que va tras `list=` en la URL).
 *  - O ajusta las palabras clave de `seriesKeywords`.
 */
export const youtube = {
  channelId: "UCiVeSJkvXc36kt5jt-Ifl9g",
  handle: "@andrescuberomoreno",
  channelUrl: "https://www.youtube.com/@andrescuberomoreno",
  subscribeUrl: "https://www.youtube.com/@andrescuberomoreno?sub_confirmation=1",
  /**
   * Listas de reproducción por sección. Si existen, mandan sobre las palabras clave.
   * En Objetivo Dakar, el orden de la lista = número de capítulo (1, 2, 3…).
   */
  playlists: {
    "objetivo-dakar": null as string | null,
    workshop: null as string | null,
    "sim-racing": null as string | null,
  },
  /** Clasificación automática por título cuando no hay lista configurada (sin acentos, minúsculas). */
  seriesKeywords: {
    "objetivo-dakar": ["dakar", "rally", "regularidad", "tramo", "copiloto", "roadbook", "offroad classic", "certt", "maroc", "marruecos"],
    workshop: ["taller", "starlink", "reparar", "arreglar", "instalar", "pajero", "fabric", "restaur", "soldar", "homocinetica", "salpicadero", "gotera", "tractor"],
    "sim-racing": ["sim racing", "simulador", "simracing", "cockpit", "farming simulator", "project motor racing", "volante"],
  },
  /** Otros canales cuyos vídeos también se leen (p. ej. "Manitas a tiempo completo"). IDs que empiezan por UC. */
  extraChannelIds: [] as string[],
  revalidateSeconds: 3600,
} as const;
