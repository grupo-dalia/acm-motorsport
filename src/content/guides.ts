/**
 * Colecciones del catálogo de guías (/guias). Cada guía (artículo con `kind: guide`)
 * se apunta a una colección con `collection:` y su orden dentro de ella con `order:`.
 * `upcoming` son guías planificadas: salen en el catálogo como "Próximamente", sin enlace.
 */
export type GuideCollection = {
  id: string;
  title: string;
  lead: string;
  upcoming: string[];
};

export const guideCollections: GuideCollection[] = [
  {
    id: "empezar-rally",
    title: "Empezar en el rally",
    lead: "Lo que nadie te explica antes de tu primera carrera.",
    upcoming: ["Cómo leer un roadbook", "Tu primera carrera: papeles, licencia y verificaciones", "El copiloto perfecto: qué hace y cómo entrenarlo"],
  },
  {
    id: "starlink",
    title: "Internet en ruta con Starlink",
    lead: "Conexión por satélite en el coche, contada desde el techo del Pajero.",
    upcoming: ["Starlink Mini en movimiento: qué funciona y qué no"],
  },
  {
    id: "pista",
    title: "Salir vivo de la pista",
    lead: "Averías, pinchazos y atascos: cómo resolverlos lejos del taller.",
    upcoming: ["Pinchazo en pista: cambiar la rueda o repararla con mechas", "Desatascar un 4x4 sin romper nada", "Kit de herramientas mínimo para un raid"],
  },
  {
    id: "pajero",
    title: "Mitsubishi Pajero MK1",
    lead: "Todo lo que hemos aprendido con un Pajero de 1989.",
    upcoming: ["Goteras en el techo del Pajero: dónde entra el agua y cómo sellarla", "Ruido en la homocinética: diagnóstico y cambio"],
  },
];

export const collectionById = (id: string) => guideCollections.find((c) => c.id === id);
