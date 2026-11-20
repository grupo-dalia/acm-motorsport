/** Textos de la interfaz de los manuales, por idioma. */
export type ManualLang = "es" | "en";

export const manualUi = {
  es: {
    steps: "Pasos", step: "Paso", of: "de", prev: "Anterior", next: "Siguiente", done: "¡Hecho! Volver al inicio",
    seeFig: "Ver fig.", caution: "Ojo", before: "Antes de empezar", after: "Al terminar", view: "Vista", workshop: "Modo taller", list: "Lista",
    data: "Datos", figures: "Todas las figuras", tip: "Consejo ACM", parts: "Recambios para este trabajo", pending: "pendiente",
    partsNote: "Catálogo de Euro4x4parts filtrado para este vehículo. Euro4x4parts es patrocinador de ACM Motorsport.",
    systems: "Sistemas del vehículo", openPage: "Abrir este trabajo en su página",
    beltHint: "Dibujo ACM Motorsport · vista de frente · toca una pieza", piece: "Pieza", reference: "Referencia", tbc: "por confirmar", torque: "Apriete",
    beltShop: "Ver recambios en Euro4x4parts", beltEmpty: "Toca una pieza del dibujo o de la lista para ver su referencia, su apriete y dónde comprarla.",
    sponsor: "Euro4x4parts es patrocinador de ACM Motorsport.",
    guides: "Guías", more: "Más trabajos del", full: "Manual completo", allJobs: "Todos los trabajos, uno por página", index: "Índice del manual",
    sparesAll: "Ver todos los recambios del", sparesNote: "Se compran en Euro4x4parts, patrocinador de ACM Motorsport. Precio orientativo.",
    torqueLd: "Apriete", cautionLd: "Ojo",
  },
  en: {
    steps: "Steps", step: "Step", of: "of", prev: "Back", next: "Next", done: "Done! Back to the start",
    seeFig: "See fig.", caution: "Careful", before: "Before you start", after: "When you finish", view: "View", workshop: "Workshop mode", list: "List",
    data: "Specifications", figures: "All figures", tip: "ACM tip", parts: "Parts for this job", pending: "pending",
    partsNote: "Euro4x4parts catalogue filtered for this vehicle. Euro4x4parts sponsors ACM Motorsport.",
    systems: "Vehicle systems", openPage: "Open this job on its own page",
    beltHint: "ACM Motorsport drawing · front view · tap a part", piece: "Part", reference: "Part number", tbc: "to be confirmed", torque: "Torque",
    beltShop: "See parts at Euro4x4parts", beltEmpty: "Tap a part on the drawing or the list to see its part number, torque and where to buy it.",
    sponsor: "Euro4x4parts sponsors ACM Motorsport.",
    guides: "Guides", more: "More jobs from the", full: "Full manual", allJobs: "Every job, one per page", index: "Manual index",
    sparesAll: "See all parts for the", sparesNote: "Sold by Euro4x4parts, sponsor of ACM Motorsport. Indicative price.",
    torqueLd: "Torque", cautionLd: "Careful",
  },
} as const;

export type ManualUi = (typeof manualUi)[ManualLang];
