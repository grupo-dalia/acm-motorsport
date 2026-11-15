/**
 * Manual interactivo del Lada Niva 1600 (VAZ-2121, 1977-1994), motor 2121 de 1,6 L de carburación.
 * Datos técnicos sacados del manual de reparación del VAZ-2121; textos y esquemas redactados por ACM.
 *
 * FIGURAS: esquemas propios de ACM en `public/manual/lada-niva/<file>.svg`. Para cambiar uno por una foto,
 * deja `<file>.webp|jpg|png` con el mismo nombre y borra el svg.
 */

import type { ManualVehicle, System } from "@/content/manual-types";

export const nivaVehicle: ManualVehicle = {
  model: "Lada Niva 1600",
  chassis: "VAZ-2121",
  years: "1977-1994",
  engine: "2121 · 1,6 L gasolina, carburación",
  basePath: "/manual/lada-niva",
  photo: {
    file: "coche.jpg",
    alt: "Lada Niva 1600 de 1989, tres puertas, visto de frente y de lado",
    author: "OSX",
    license: "Dominio público",
    source: "https://commons.wikimedia.org/wiki/File:1989_Lada_Niva_1600_3-door_wagon_(2015-07-14)_01.jpg",
  },
};

export const nivaSystems: System[] = [
  {
    id: "motor",
    title: "Motor 2121",
    parts: [
      {
        id: "ficha",
        title: "Datos rápidos",
        summary: "Lo que se busca a tiro fijo: aceite, agua, holguras, encendido y presiones. Todo del motor 1,6 de carburación.",
        specs: [
          { label: "Aceite de motor", value: "3,75", unit: "L", note: "con filtro" },
          { label: "Refrigerante", value: "10,7", unit: "L", note: "circuito completo con la calefacción" },
          { label: "Depósito de gasolina", value: "42", unit: "L", note: "con 4-6,5 L de reserva" },
          { label: "Orden de encendido", value: "1-3-4-2", note: "el cigüeñal gira a derechas" },
          { label: "Ralentí", value: "850-900", unit: "rpm", note: "750-800 con carburador 2106-1107010" },
          { label: "Avance inicial", value: "3-5°", note: "antes del PMS · 1 ± 1° con encendido electrónico" },
          { label: "Separación de bujías", value: "0,5-0,6", unit: "mm", note: "0,7-0,8 con encendido electrónico" },
          { label: "Presión de aceite a 5.400 rpm", value: "3,5-4,5", unit: "kgf/cm²", note: "aceite a 85 °C" },
          { label: "Temperatura del motor caliente", value: "95", unit: "°C" },
          { label: "Flecha de la correa del ventilador", value: "10-15", unit: "mm", note: "apretando con 10 kg" },
        ],
      },
      {
        id: "culata",
        title: "Culata y junta",
        summary: "La culata sale con el motor en el coche. El colector de admisión con el carburador y el de escape pueden salir pegados a ella: menos trabajo y menos juntas.",
        warning: "Junta de culata y junta de la tapa de balancines siempre nuevas. Y la tapa, como mucho a 8 N·m: con más se rompe la junta o se alabea la tapa.",
        specs: [
          { label: "Culata, 1.ª pasada (tornillos 1 a 10)", value: "33-41", unit: "N·m", note: "3,4-4,2 kgf·m" },
          { label: "Culata, 2.ª pasada (tornillos 1 a 10)", value: "96-118", unit: "N·m", note: "9,8-12,1 kgf·m" },
          { label: "Culata, tornillo 11", value: "31-39", unit: "N·m", note: "3,2-4,0 kgf·m" },
          { label: "Tuercas de la tapa de balancines", value: "≤ 8", unit: "N·m" },
        ],
        figures: [
          { file: "culata-orden-apriete", caption: "Cómo se aprieta: del centro hacia los extremos y en dos pasadas", ref: "Orden numerado exacto: fig. 2-16 del manual" },
          { file: "distribucion-marcas", caption: "Marcas de calado antes de soltar el árbol de levas", ref: "Manual fig. 7-19 y 2-19" },
        ],
        procedures: [{ title: "Quitar y poner la culata", steps: [
          { title: "Saca la rueda de repuesto", text: "En el Niva va en el vano motor y estorba para todo lo demás." },
          { title: "Vacía el refrigerante", text: "Por el radiador y por el tapón del bloque. Quita también el filtro de aire." },
          { title: "Desconecta lo eléctrico", text: "Batería, cables de bujías, sensor de temperatura del agua y el cable del estárter del carburador." },
          { title: "Fuera bujías y sensor de temperatura", text: "Antes de que se cuele nada por los agujeros." },
          { title: "Varillaje y tapa de balancines", text: "Suelta las varillas del acelerador de la palanca intermedia y quita la tapa." },
          { title: "Pon el motor en marcas", text: "Gira el cigüeñal hasta que la marca de la polea coincida con la marca larga de la tapa de distribución, y la del piñón del árbol de levas con la de su soporte (figura 2).", figure: "distribucion-marcas" },
          { title: "Manguitos y tubos", text: "Calefacción, carburador, colector de admisión y salida de agua de la culata." },
          { title: "Escape", text: "Separa el bajante del colector de escape y la chapa que protege el motor de arranque." },
          { title: "Bloquea el tensor de la cadena", text: "Afloja la tuerca de sombrerete del tensor, empuja la varilla hacia dentro con una palanca y vuelve a apretar la tuerca para que se quede recogida." },
          { title: "Piñón y árbol de levas", text: "Quita el piñón del árbol de levas y saca el soporte con el árbol entero." },
          { title: "Afloja y levanta", text: "Afloja los tornillos de culata en el orden inverso al de apriete, poco a poco, y levanta la culata recta." },
          { title: "Monta con junta nueva", text: "Superficies limpias y junta nueva sin golpes, grietas ni el recubrimiento despegado. Culata en su sitio con el motor todavía en marcas." },
          { title: "Aprieta en dos pasadas", text: "Del centro hacia fuera (figura 1): primero todos a par bajo y después al par final. El tornillo 11 va aparte, en la segunda pasada.", torque: "33-41 N·m → 96-118 N·m · tornillo 11: 31-39 N·m", figure: "culata-orden-apriete" },
          { title: "Árbol de levas y cadena", text: "Monta el soporte con el árbol (tuercas en el orden de la fig. 2-18 del manual), el piñón con las marcas alineadas, y suelta el tensor para tensar la cadena." },
          { title: "Válvulas, tapa y lo demás", text: "Regla las válvulas en frío, monta la tapa con junta nueva y vuelve a conectar todo. Al arrancar, comprueba el avance de encendido.", torque: "Tapa: máx. 8 N·m" },
        ] }],
      },
      {
        id: "prueba-culata",
        title: "Prueba de estanqueidad",
        summary: "Si la culata ha salido por una junta quemada o por agua en el aceite, se prueba antes de montarla. Lo hace cualquier taller de rectificado.",
        specs: [
          { label: "Con agua a presión", value: "5", unit: "kgf/cm²", note: "2 minutos sin una gota" },
          { label: "Con aire, culata en agua a 60-80 °C", value: "1,5-2", unit: "kgf/cm²", note: "1-1,5 minutos sin burbujas" },
        ],
        tips: ["Si aparece una grieta, la culata se cambia. Soldarla en casa para salir del paso acaba casi siempre en otra junta quemada."],
      },
      {
        id: "distribucion",
        title: "Cadena de distribución",
        summary: "La cadena la tensa un tensor con muelle. Se reajusta sola si la dejas suelta y le das vueltas al motor.",
        specs: [{ label: "Holgura entre varilla y émbolo del tensor", value: "0,2-0,5", unit: "mm", note: "la garantiza el propio tensor" }],
        figures: [{ file: "distribucion-marcas", caption: "Marcas de calado: polea con tapa y piñón con soporte", ref: "Manual fig. 7-19 y 2-19" }],
        procedures: [{ title: "Tensar la cadena", steps: [
          { title: "Afloja la tuerca del tensor", text: "Queda libre la varilla y el muelle empuja el patín contra la cadena." },
          { title: "Dale vueltas al motor", text: "Gira el cigüeñal 1-1,5 vueltas en su sentido de giro. El muelle deja la cadena con la tensión justa." },
          { title: "Aprieta la tuerca", text: "Con la tuerca apretada, en marcha solo empuja el muelle del émbolo y el aceite amortigua los golpes de la cadena." },
        ] }],
      },
      {
        id: "valvulas",
        title: "Reglaje de válvulas",
        warning: "La primera posición (levas 8 y 6) es la del manual. Las tres siguientes salen de su tabla de reglaje y del orden de las levas: si tienes el manual a mano, cotéjalas.",
        summary: "En frío y con la cadena ya tensada. Galga plana de 0,15 mm entre leva y balancín: tiene que entrar con un poco de roce.",
        specs: [
          { label: "Holgura (admisión y escape)", value: "0,15", unit: "mm", note: "motor frío" },
          { label: "Margen admitido", value: "0,14-0,17", unit: "mm" },
        ],
        figures: [
          { file: "levas-numeracion", caption: "Numeración de las levas y qué pareja se regla en cada posición", ref: "Manual tabla 2-5" },
          { file: "valvulas-galga", caption: "Dónde va la galga y qué se afloja", ref: "Esquema ACM" },
        ],
        procedures: [{ title: "Reglaje", steps: [
          { title: "Marcas alineadas", text: "Gira el cigüeñal a derechas hasta que la marca del piñón del árbol de levas coincida con la del soporte. El cilindro 4 está al final de la compresión.", figure: "levas-numeracion" },
          { title: "Levas 8 y 6", text: "Regla el escape del cilindro 4 (leva 8) y la admisión del 3 (leva 6). Afloja la contratuerca, mete la galga entre leva y balancín y gira el tornillo hasta que entre con un poco de roce.", figure: "valvulas-galga" },
          { title: "Aprieta y vuelve a medir", text: "Al apretar la contratuerca el tornillo se mueve un pelo. Si se sale de 0,14-0,17 mm, repite." },
          { title: "Media vuelta y siguiente pareja", text: "Gira el cigüeñal 180° y regla las levas 4 y 7. Otros 180°: levas 1 y 3. Otros 180°: levas 5 y 2." },
        ] }],
      },
    ],
  },
  {
    id: "chasis",
    title: "Chasis",
    parts: [
      {
        id: "cotas",
        title: "Frenos, dirección y ruedas",
        summary: "Los reglajes que más se tocan en un Niva con años.",
        specs: [
          { label: "Juego libre del volante", value: "≤ 5°", note: "18-20 mm en el aro" },
          { label: "Convergencia delantera", value: "2-4", unit: "mm", note: "coche cargado, medida entre llantas" },
          { label: "Caída delantera", value: "0°30' ± 20'" },
          { label: "Avance", value: "3°30' ± 30'" },
          { label: "Holgura axial del rodamiento de buje", value: "0,01-0,07", unit: "mm" },
          { label: "Recorrido libre del embrague", value: "25-35", unit: "mm" },
          { label: "Recorrido libre del freno", value: "3-5", unit: "mm", note: "motor parado" },
          { label: "Freno de mano", value: "4-5 dientes", note: "tiene que sujetarlo en una pendiente del 30 %" },
        ],
      },
    ],
  },
];
