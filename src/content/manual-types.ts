/** Tipos de los manuales interactivos de /guias (Pajero III, Lada Niva…). */

export type Spec = { label: string; value: string; unit?: string; note?: string };
export type Step = { title: string; text: string; torque?: string; caution?: string; figure?: string };
export type Procedure = { title: string; intro?: string; before?: string[]; steps: Step[]; after?: string[] };
/** `file` sin extensión: se busca en `<basePath>/<file>.(svg|webp|jpg|png)`. */
export type Figure = { file: string; caption: string; ref?: string };

export type Part = {
  id: string;
  title: string;
  summary: string;
  warning?: string;
  specs?: Spec[];
  procedures?: Procedure[];
  figures?: Figure[];
  tips?: string[];
};

export type System = { id: string; title: string; parts: Part[] };

/** Foto del coche (licencia libre) que sale en la cabecera y en la vista previa del enlace. `file` relativo a `basePath`. */
export type VehiclePhoto = { file: string; alt: string; author: string; license: string; source: string };

export type ManualVehicle = { model: string; chassis: string; years: string; engine: string; basePath: string; photo?: VehiclePhoto };
