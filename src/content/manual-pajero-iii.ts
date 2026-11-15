/**
 * Manual interactivo del Mitsubishi Pajero III (V60/V70, 2001-2002) con motor 4D56 2.5 TD.
 * Datos técnicos sacados del manual de taller; textos redactados por ACM.
 *
 * FIGURAS: cada figura tiene un `file`. Para que aparezca en la web basta con dejar la imagen en
 * `public/manual/pajero-iii/<file>` (jpg, png o webp con ese mismo nombre). Mientras no exista,
 * la web enseña un hueco con el pie de foto y la página del manual de referencia (`ref`).
 */

export type Spec = { label: string; value: string; unit?: string; note?: string };
export type Step = { title: string; text: string; torque?: string };
export type Figure = { file: string; caption: string; ref?: string };

export type Part = {
  id: string;
  title: string;
  summary: string;
  warning?: string;
  specs?: Spec[];
  steps?: Step[];
  figures?: Figure[];
  tips?: string[];
};

export type System = { id: string; title: string; parts: Part[] };

export const manualVehicle = {
  model: "Mitsubishi Pajero III",
  chassis: "V60 / V70",
  years: "2001-2002",
  engine: "4D56 · 2.5 turbodiésel intercooler",
  basePath: "/manual/pajero-iii",
};

export const manualSystems: System[] = [
  {
    id: "motor",
    title: "Motor 4D56",
    parts: [
      {
        id: "ficha",
        title: "Ficha del motor",
        summary: "El 2.5 TD de cuatro cilindros en línea, con árbol de levas en cabeza, balancines de rodillo y ejes de equilibrado movidos por su propia correa.",
        warning: "En 2002 el Pajero III estrenó bomba inyectora de control electrónico. Con ella cambiaron el ralentí, el apriete de culata y la junta. Mira siempre de qué año es tu motor.",
        specs: [
          { label: "Cilindrada", value: "2.477", unit: "cc" },
          { label: "Diámetro × carrera", value: "91,1 × 95,0", unit: "mm" },
          { label: "Relación de compresión", value: "21:1" },
          { label: "Distribución", value: "SOHC", note: "4 válvulas de admisión y 4 de escape en total" },
          { label: "Cámara de combustión", value: "Precámara de turbulencia" },
          { label: "Balancines", value: "De rodillo", note: "tornillo de reglaje tipo pata de elefante" },
          { label: "Admisión abre / cierra", value: "20° APMS / 49° DPMI" },
          { label: "Escape abre / cierra", value: "55° APMI / 22° DPMS" },
        ],
      },
      {
        id: "culata",
        title: "Culata y junta",
        summary: "18 tornillos que se aprietan en espiral desde el centro hacia fuera. Se aflojan en orden inverso y poco a poco, para no deformar la culata.",
        warning: "El par depende del año. Motor 2001 (bomba mecánica): una pasada a 132 N·m en frío. Motor 2002 (bomba electrónica): 29 N·m y luego 120° de ángulo, siempre en el mismo orden.",
        specs: [
          { label: "Tornillos de culata (2001)", value: "132 ± 5", unit: "N·m", note: "con el motor frío" },
          { label: "Tornillos de culata (2002)", value: "29 ± 2 + 120°", note: "rosca y arandela con un poco de aceite" },
          { label: "Grosor de junta", value: "1,45 · 1,50 · 1,55", unit: "mm", note: "aplastada; se elige según lo que sobresalen los pistones" },
          { label: "Tubos de inyección", value: "30 ± 6", unit: "N·m" },
        ],
        figures: [
          { file: "culata-orden-apriete", caption: "Orden de apriete de los 18 tornillos de culata (vista desde arriba, delante a la izquierda)", ref: "Manual 11B-33 (2001) · 11B-16 (2002)" },
          { file: "culata-arandela", caption: "Posición del bisel de la arandela del tornillo de culata", ref: "Manual 11B-32" },
          { file: "culata-junta-marcas", caption: "Dónde mirar la marca de grosor de la junta", ref: "Manual 11B-32 · 11B-15" },
        ],
        steps: [
          { title: "Afloja en orden inverso", text: "Con el motor frío, afloja los tornillos de culata siguiendo el orden de apriete al revés, del último al primero, en varias pasadas. Hace falta la llave de vaso específica para la cabeza de estos tornillos." },
          { title: "Elige la junta", text: "Si solo cambias la junta, pide la del mismo grosor que la vieja: lleva una marca que lo indica. Si has cambiado pistones o bielas, mide cuánto sobresalen los pistones y elige el grosor de nuevo." },
          { title: "Limpia las superficies", text: "Rasca los restos de junta del bloque y de la culata sin que caiga nada en los pasos de agua, de aceite ni en los cilindros." },
          { title: "Arandelas y aceite", text: "Monta las arandelas de los tornillos con el bisel en su posición. En el motor de 2002, pon una gota de aceite en la rosca y bajo la arandela." },
          { title: "Aprieta en espiral", text: "Aprieta en el orden de la figura, empezando por los del centro. En el motor de 2001, una pasada al par final. En el de 2002, primero todos al par inicial y después el ángulo, en el mismo orden.", torque: "132 N·m (2001) · 29 N·m + 120° (2002)" },
          { title: "Tubos de inyección", text: "Al apretar los racores de los tubos, sujeta con otra llave el racor de la bomba o del inyector para que no gire.", torque: "30 N·m" },
        ],
      },
      {
        id: "distribucion",
        title: "Correas de distribución",
        summary: "Dos correas: la principal (cigüeñal, bomba inyectora y árbol de levas) y la B, que va por detrás y mueve los ejes de equilibrado. La B se monta primero.",
        warning: "Gira el cigüeñal siempre en sentido horario. Nunca hacia atrás durante el trabajo.",
        specs: [
          { label: "Flecha de la correa principal", value: "4–5", unit: "mm" },
          { label: "Flecha de la correa B", value: "4–5", unit: "mm" },
          { label: "Tornillos y tuerca de los tensores", value: "26 ± 3", unit: "N·m" },
          { label: "Tornillos de las tapas", value: "M6 × 22 · 50 · 60", note: "cada largo va en su agujero" },
        ],
        figures: [
          { file: "distribucion-marcas", caption: "Marcas de distribución con el cilindro 1 en PMS", ref: "Manual 11B-21" },
          { file: "distribucion-tensor-principal", caption: "Tensor de la correa principal: tornillos A y B", ref: "Manual 11B-22" },
          { file: "distribucion-correa-b", caption: "Correa B: marcas de los tres piñones, tensor (C y D) y lado tenso", ref: "Manual 11B-22" },
          { file: "distribucion-recorrido", caption: "Recorrido de la correa principal y dónde medir la flecha", ref: "Manual 11B-23 · 11B-24" },
        ],
        steps: [
          { title: "Cilindro 1 en PMS", text: "Gira el cigüeñal en sentido horario hasta que coincidan todas las marcas, con el cilindro 1 en compresión." },
          { title: "Marca el sentido", text: "Si vas a reutilizar alguna correa, píntale una flecha con el sentido de giro." },
          { title: "Afloja los tensores", text: "Afloja los tornillos del tensor principal, empújalo hacia la bomba de agua y vuelve a apretarlo para dejar la correa floja. Haz lo mismo con el tensor de la correa B." },
          { title: "Monta la correa B", text: "Con las marcas de los tres piñones alineadas, monta la correa sin holgura en el lado tenso. Suelta el tensor para que lo empuje solo el muelle. Aprieta primero la tuerca y después el tornillo: al revés, el tensor gira y la pasa de tensión.", torque: "26 N·m" },
          { title: "Monta la principal", text: "En este orden: cigüeñal, bomba inyectora, tensor y árbol de levas, sin holgura en el lado tenso. Sujeta el piñón de la bomba en su marca, que tiende a girarse." },
          { title: "Tensa con el muelle", text: "Afloja el tensor para que actúe el muelle y gira el cigüeñal 2 dientes en sentido horario sin tocar la correa. Luego aprieta los tornillos del tensor en el orden del manual: si empiezas por el de abajo, queda demasiado tensa.", torque: "26 N·m" },
          { title: "Comprueba", text: "Da dos vueltas completas, vuelve al PMS y comprueba que todas las marcas coinciden y que la flecha de las dos correas está en su valor." },
        ],
        tips: ["Si tienes todo abierto, cambia también la correa B y revisa los tensores y la bomba de agua. Volver a desmontar por una correa barata es lo que más duele."],
      },
      {
        id: "valvulas",
        title: "Reglaje de válvulas",
        summary: "Se hace con el motor caliente y en dos pasadas: la mitad de las válvulas con el cilindro 1 en PMS y la otra mitad con el 4.",
        specs: [{ label: "Holgura (admisión y escape)", value: "0,25", unit: "mm", note: "motor caliente, refrigerante a 80–90 °C" }],
        figures: [
          { file: "valvulas-pms-1", caption: "Válvulas que se reglan con el cilindro 1 en PMS", ref: "Manual 11B-8" },
          { file: "valvulas-pms-4", caption: "Válvulas que se reglan con el cilindro 4 en PMS", ref: "Manual 11B-9" },
          { file: "valvulas-sellador", caption: "Dónde va el sellador de las juntas semicirculares", ref: "Manual 11B-9" },
        ],
        steps: [
          { title: "Calienta el motor", text: "Hasta que el refrigerante esté a 80–90 °C." },
          { title: "Destapa", text: "Quita la tapa superior de la correa de distribución y la tapa de balancines." },
          { title: "Cilindro 1 en PMS", text: "Alinea la marca del piñón del árbol de levas girando el cigüeñal en sentido horario." },
          { title: "Mide y ajusta", text: "Mide las válvulas de la primera figura metiendo la galga desde el centro de la culata hacia fuera. Si no está en su valor, afloja la contratuerca, gira el tornillo hasta que la galga pase justa, sujeta el tornillo con un destornillador y aprieta la contratuerca." },
          { title: "Cilindro 4 en PMS", text: "Gira el cigüeñal una vuelta completa (360°) en sentido horario y repite con las válvulas de la segunda figura." },
          { title: "Cierra", text: "Pon sellador en las juntas semicirculares, monta la tapa de balancines y la tapa de la distribución." },
        ],
      },
      {
        id: "lubricacion",
        title: "Aceite y filtro",
        summary: "6,5 litros en total, contando filtro y enfriador. Cámbialo con el motor caliente para que salga todo.",
        specs: [
          { label: "Aceite de motor (total)", value: "6,5", unit: "L", note: "incluye 0,8 L del filtro y 0,4 L del enfriador" },
          { label: "Calidad mínima", value: "API CD" },
          { label: "Tapón de vaciado del cárter", value: "39 ± 5", unit: "N·m", note: "arandela nueva" },
          { label: "Presión de aceite al ralentí", value: "≥ 0,29", unit: "bar" },
          { label: "Presión a 3.500 rpm", value: "2,9 – 6,9", unit: "bar" },
        ],
        figures: [{ file: "aceite-arandela-tapon", caption: "Orientación de la arandela del tapón de vaciado", ref: "Manual 12-4" }],
        steps: [
          { title: "Calienta", text: "Arranca y deja el motor hasta que el refrigerante llegue a 80–90 °C." },
          { title: "Vacía", text: "Quita el tapón de llenado y luego el de vaciado. Cuidado, que el aceite sale caliente." },
          { title: "Cambia el filtro", text: "Quita la tapa inferior y el filtro con su llave. Limpia el asiento, pon un poco de aceite en la junta del filtro nuevo y apriétalo desde que la junta toca." },
          { title: "Cierra y llena", text: "Tapón de vaciado con arandela nueva, bien orientada, al par. Llena y comprueba el nivel con la varilla.", torque: "39 N·m" },
        ],
      },
      {
        id: "refrigeracion",
        title: "Refrigeración",
        summary: "Circuito de 9 litros (10,5 con calefacción trasera). Termostato que empieza a abrir a 82 °C.",
        specs: [
          { label: "Refrigerante", value: "9,0 / 10,5", unit: "L", note: "sin / con calefacción trasera, incluye depósito" },
          { label: "Anticongelante", value: "30 – 60", unit: "%" },
          { label: "Termostato empieza a abrir", value: "82 ± 1,5", unit: "°C" },
          { label: "Termostato totalmente abierto", value: "95", unit: "°C", note: "con 8,5 mm o más de recorrido" },
          { label: "Tapón del radiador", value: "0,74 – 1,03", unit: "bar", note: "límite 0,64 bar" },
        ],
      },
      {
        id: "compresion",
        title: "Compresión y ralentí",
        summary: "Para saber cómo está el motor por dentro antes de meterle mano.",
        specs: [
          { label: "Compresión a 280 rpm", value: "30,4", unit: "bar", note: "mínimo 22 bar" },
          { label: "Diferencia máxima entre cilindros", value: "2,9", unit: "bar" },
          { label: "Ralentí (2001, bomba mecánica)", value: "750 ± 100", unit: "rpm" },
          { label: "Ralentí (2002, bomba electrónica)", value: "750 ± 30", unit: "rpm", note: "lo controla la centralita" },
        ],
      },
    ],
  },
  {
    id: "transmision",
    title: "Transmisión",
    parts: [
      {
        id: "caja-reductora",
        title: "Caja de cambios y reductora",
        summary: "Caja manual V5MT1 de cinco marchas y reductora de dos velocidades.",
        specs: [
          { label: "Aceite de caja", value: "3,2", unit: "L", note: "hipoidal 75W-90 o 75W-85W, API GL-4" },
          { label: "Aceite de reductora", value: "2,5", unit: "L", note: "hipoidal 75W-90 o 75W-85W, API GL-4" },
          { label: "Desarrollos", value: "3,918 · 2,261 · 1,395 · 1,000 · 0,829", note: "de primera a quinta" },
          { label: "Marcha atrás", value: "3,925" },
          { label: "Reductora alta / baja", value: "1,000 / 1,925" },
        ],
      },
      {
        id: "diferenciales",
        title: "Diferenciales",
        summary: "Aceite hipoidal GL-5 en los dos puentes.",
        specs: [
          { label: "Diferencial delantero", value: "1,2", unit: "L", note: "API GL-5, SAE 90 / 80W" },
          { label: "Diferencial trasero", value: "≈ 1,6", unit: "L", note: "API GL-5, SAE 90 / 80W" },
        ],
      },
    ],
  },
  {
    id: "chasis",
    title: "Chasis y dirección",
    parts: [
      {
        id: "ruedas",
        title: "Ruedas",
        summary: "Par de las tuercas de rueda y de la rueda de repuesto.",
        specs: [
          { label: "Tuercas de rueda", value: "108 ± 10", unit: "N·m" },
          { label: "Soporte de la rueda de repuesto", value: "46 ± 8", unit: "N·m", note: "válvula hacia arriba para que no entre agua" },
        ],
      },
      {
        id: "direccion",
        title: "Dirección asistida",
        summary: "Líquido de la dirección asistida.",
        specs: [{ label: "Líquido", value: "≈ 0,6", unit: "L", note: "ATF Dexron II" }],
      },
    ],
  },
];
