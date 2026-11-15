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
  exploded?: ExplodedView;
  /** Vistas de frente de las correas (dibujo ACM con la geometría real). */
  beltViews?: BeltView[];
};

export type System = { id: string; title: string; parts: Part[] };

/** Foto del coche (licencia libre) que sale en la cabecera y en la vista previa del enlace. `file` relativo a `basePath`. */
export type VehiclePhoto = { file: string; alt: string; author: string; license: string; source: string };

export type ManualVehicle = { model: string; chassis: string; years: string; engine: string; basePath: string; photo?: VehiclePhoto };

/** Forma con la que se dibuja una pieza en un despiece (dibujo propio de ACM, generado por código). */
export type PartShape =
  | { kind: "sprocket"; r: number; teeth: number }
  | { kind: "pulley"; r: number; grooves?: number }
  | { kind: "belt"; w: number; h: number; teeth?: boolean }
  | { kind: "cover"; w: number; h: number }
  | { kind: "tensioner"; r: number }
  | { kind: "spring" }
  | { kind: "bolt"; len: number }
  | { kind: "ring"; r: number }
  /** Polea con damper: llanta con gargantas, anillo de goma y buje. */
  | { kind: "damper"; r: number; grooves: number; depth: number }
  /** Embrague viscoso del ventilador: disco con aletas. */
  | { kind: "fanclutch"; r: number }
  /** Tensor automático: cuerpo con brazo y polea lisa. */
  | { kind: "autotensioner"; r: number };

export type ExplodedPart = {
  n: number;
  name: string;
  qty?: number;
  /** Referencia original del fabricante, si la tenemos confirmada. */
  oe?: string;
  /** Texto con el que buscarla en la tienda cuando no hay referencia. */
  search?: string;
  torque?: string;
  note?: string;
  shape: PartShape;
  x: number;
  y: number;
  /** Dónde va el número, relativo a la pieza (línea de referencia hasta ella). */
  label?: { dx: number; dy: number };
};

/** Despiece interactivo: piezas numeradas en su orden de montaje, colocadas sobre un eje. */
export type ExplodedView = { title: string; intro?: string; width: number; height: number; axis?: { x1: number; y1: number; x2: number; y2: number }; parts: ExplodedPart[] };

/** Pieza dibujada en una vista de frente de la correa. Radio negativo = la correa apoya la espalda (rodillo tensor). */
export type BeltPulley = {
  n: number;
  name: string;
  x: number;
  y: number;
  r: number;
  kind: "sprocket" | "idler";
  teeth?: number;
  oe?: string;
  search?: string;
  torque?: string;
  note?: string;
  /** Dirección del número (grados, 0 = derecha, 90 = abajo). */
  labelAngle?: number;
};

export type BeltView = {
  title: string;
  intro?: string;
  width: number;
  height: number;
  pulleys: BeltPulley[];
  /** Números de pieza en el orden en que los recorre la correa (sentido horario en pantalla). */
  order: number[];
  belt: Omit<BeltPulley, "x" | "y" | "r" | "kind" | "teeth" | "labelAngle">;
  /** Flecha de giro del cigüeñal y textos sueltos. */
  notes?: { x: number; y: number; text: string }[];
};
