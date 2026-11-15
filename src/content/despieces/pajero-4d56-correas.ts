import type { BeltView } from "@/content/manual-types";

/**
 * Correas de distribución del 4D56 vistas de frente. Dibujo de ACM: centros y diámetros
 * medidos sobre la geometría real del motor (proporciones respetadas: el piñón del cigüeñal
 * es la mitad que el del árbol de levas y la bomba; el del cigüeñal B, el doble que el del eje
 * equilibrador). La correa se calcula tangente a cada rueda.
 */

const s = (q: string) => `${q} 4D56`;

export const correaDistribucion4d56: BeltView = {
  title: "Correa de distribución (vista de frente)",
  intro:
    "Así va la correa con la tapa quitada. Se monta en este orden: cigüeñal, bomba inyectora, tensor y árbol de levas, sin dejar holgura en el lado tenso (entre cigüeñal y bomba).",
  width: 900,
  height: 820,
  order: [1, 2, 3, 4],
  pulleys: [
    { n: 1, name: "Piñón del árbol de levas", kind: "sprocket", x: 260, y: 240, r: 88, search: s("piñon arbol de levas"), torque: "69 ± 5 N·m", note: "Arriba a la izquierda. Su marca tiene que quedar alineada con la de la culata en PMS del cilindro 1.", labelAngle: 200 },
    { n: 2, name: "Piñón de la bomba inyectora", kind: "sprocket", x: 595, y: 402, r: 92, search: s("piñon bomba inyectora"), note: "Mismo tamaño que el de levas (gira a media vuelta de cigüeñal). Sujétalo en su marca mientras metes la correa.", labelAngle: -20 },
    { n: 3, name: "Piñón del cigüeñal", kind: "sprocket", x: 323, y: 713, r: 46, search: s("piñon cigueñal distribucion"), note: "Abajo. Detrás va el piñón B, que mueve la correa del equilibrador.", labelAngle: 200 },
    { n: 4, name: "Tensor de la correa de distribución", kind: "idler", x: 428, y: 331, r: -43, search: s("tensor correa distribucion"), torque: "26 ± 3 N·m", note: "Apoya en la espalda de la correa, entre levas y cigüeñal. Con la correa puesta, suelta los pernos para que tense el muelle, gira el cigüeñal 2 dientes del piñón de levas a derechas y aprieta primero el perno del agujero profundo.", labelAngle: 10 },
  ],
  belt: { n: 5, name: "Correa de distribución", search: s("kit distribucion"), note: "Marca una flecha con el sentido de giro si la vas a reutilizar. Comprobación: 4-5 mm de flecha empujando en el tramo de arriba (levas–bomba). Lo normal es cambiarla junto con el tensor." },
  notes: [{ x: 40, y: 50, text: "El cigüeñal gira siempre a derechas visto de frente. Nunca a izquierdas." }],
};

export const correaB4d56: BeltView = {
  title: "Correa B del eje equilibrador (vista de frente)",
  intro:
    "Va detrás de la correa grande. Primero alinea las marcas de las 3 ruedas dentadas, monta la correa sin holgura en el lado tenso (el de la derecha) y deja que el tensor B la tense con el muelle.",
  width: 900,
  height: 820,
  order: [11, 12, 13, 14],
  pulleys: [
    { n: 11, name: "Piñón del eje equilibrador", kind: "sprocket", x: 729, y: 212, r: 62, search: s("piñon eje equilibrador"), note: "Arriba a la derecha. Gira al doble que el cigüeñal.", labelAngle: -40 },
    { n: 12, name: "Piñón B del cigüeñal", kind: "sprocket", x: 466, y: 646, r: 125, search: s("piñon B cigueñal"), note: "El grande, justo detrás del piñón de la correa principal. Al quitarlo tienes acceso al retén delantero del cigüeñal.", labelAngle: 20 },
    { n: 13, name: "Piñón izquierdo de la correa B", kind: "sprocket", x: 204, y: 596, r: 62, search: s("piñon correa equilibrador"), note: "Lleva marca de distribución, igual que los otros dos.", labelAngle: 190 },
    { n: 14, name: "Tensor B", kind: "idler", x: 590, y: 345, r: -79, search: s("tensor correa equilibrador"), torque: "26 ± 3 N·m", note: "Empuja la espalda de la correa en el lado flojo. Al apretar: primero la tuerca D y luego el perno C; si lo haces al revés el tensor gira y la deja demasiado tensa. Flecha correcta: 4-5 mm en el lado tenso.", labelAngle: -110 },
  ],
  belt: { n: 15, name: "Correa de distribución B", search: s("correa equilibrador"), note: "Marca el sentido de giro si la vas a reutilizar. Se cambia siempre que se cambie la grande: si se rompe, se mete en la principal." },
};
