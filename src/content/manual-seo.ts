/**
 * Títulos y descripciones de búsqueda de cada trabajo de los manuales.
 * Escritos como busca la gente ("cómo cambiar…", "par de apriete…"), con modelo y motor.
 */
export type PartSeo = { title: string; description: string };

export const pajeroSeo: Record<string, PartSeo> = {
  ficha: { title: "Ficha técnica motor 4D56 del Mitsubishi Pajero III 2.5 TD", description: "Datos del motor 4D56 2.5 TD del Pajero III (2001-2002): cilindrada, compresión, orden de encendido, aceite, capacidades y aprietes principales." },
  "correa-auxiliar": { title: "Cambiar la correa de accesorios del Pajero III 2.5 TD (4D56)", description: "Cómo revisar, quitar y montar la correa serpentina y la del aire acondicionado del Mitsubishi Pajero III 2.5 TD, con el truco de la llave Allen en el tensor." },
  distribucion: { title: "Cambiar la correa de distribución del Pajero III 2.5 TD (4D56)", description: "Paso a paso para cambiar la correa de distribución y la correa B del Mitsubishi Pajero 2.5 TD 4D56: marcas, recorrido de la correa, tensores y aprietes." },
  "tension-distribucion": { title: "Tensar la correa de distribución del Pajero 2.5 TD (4D56)", description: "Cómo retensar la correa principal y la correa B del 4D56 del Pajero III sin desmontarla: orden de los tornillos, flecha correcta y errores típicos." },
  valvulas: { title: "Reglaje de válvulas del Mitsubishi Pajero 2.5 TD (4D56)", description: "Holgura de válvulas del 4D56 en caliente, qué válvulas se reglan con el cilindro 1 y con el 4 en PMS, y cómo cerrar la tapa sin fugas." },
  "arbol-levas": { title: "Cambiar el retén del árbol de levas del Pajero 2.5 TD (4D56)", description: "Desmontaje y montaje del árbol de levas y su retén en el 4D56 del Pajero III sin perder la distribución: números de tapas, aprietes y profundidad del retén." },
  culata: { title: "Junta de culata Pajero III 2.5 TD: orden y par de apriete", description: "Cómo cambiar la junta de culata del 4D56 del Pajero III: orden de aflojado y de apriete de los 18 tornillos, par de 2001 y 2002 y cómo elegir el grosor de junta." },
  aceite: { title: "Cambio de aceite y filtro del Mitsubishi Pajero 2.5 TD (4D56)", description: "Qué aceite lleva el Pajero III 2.5 TD, cuántos litros con filtro, apriete del tapón y cómo leer la varilla." },
  carter: { title: "Desmontar el cárter de aceite del Pajero III 2.5 TD (4D56)", description: "Cómo quitar y sellar el cárter del 4D56 del Pajero III: qué hay que soltar, por dónde va el cordón de sellador y aprietes." },
  "retenes-ciguenal": { title: "Cambiar los retenes del cigüeñal del Pajero 2.5 TD (4D56)", description: "Retén delantero y trasero del cigüeñal del 4D56 del Pajero III: cómo sacarlos, montarlos con su guía y aprietes del volante." },
  refrigeracion: { title: "Bomba de agua y termostato del Pajero III 2.5 TD (4D56)", description: "Cambiar refrigerante, termostato y bomba de agua del Mitsubishi Pajero 2.5 TD: capacidad, dónde están los tapones de vaciado y medida de cada tornillo." },
  gasoil: { title: "Purgar el gasoil y cambiar el filtro del Pajero 2.5 TD (4D56)", description: "Cómo sacar el agua del filtro de gasoil, purgar el aire y probar los inyectores del Mitsubishi Pajero III 2.5 TD." },
  "bomba-inyectora": { title: "Calar y ajustar la bomba inyectora del Pajero 2.5 TD (4D56)", description: "Cómo comprobar y ajustar el calado de la bomba de inyección del Mitsubishi Pajero III 2.5 TD (motor de 2001, bomba mecánica) con reloj comparador, y cómo ajustar el ralentí." },
  turbo: { title: "Turbo del Pajero III 2.5 TD: presión de soplado y wastegate", description: "Cómo medir la presión del turbo del 4D56, probar el actuador de la wastegate y desmontar el turbo del Mitsubishi Pajero III 2.5 TD." },
  calentadores: { title: "Comprobar los calentadores del Mitsubishi Pajero 2.5 TD (4D56)", description: "Cómo comprobar los calentadores del 4D56 del Pajero III con el polímetro, y datos del alternador y la carga." },
  compresion: { title: "Prueba de compresión del motor 4D56 del Pajero 2.5 TD", description: "Cómo medir la compresión del 4D56 del Pajero III: qué conector soltar, valores normales y mínimos y diferencia máxima entre cilindros." },
  embrague: { title: "Embrague del Mitsubishi Pajero III 2.5 TD: datos y ajuste", description: "Datos del embrague del Pajero III 2.5 TD: tipo, mando hidráulico y líquido que lleva." },
  "caja-reductora": { title: "Aceite de la caja de cambios y reductora del Pajero III", description: "Qué aceite y cuánto lleva la caja de cambios y la reductora del Mitsubishi Pajero III 2.5 TD, y cómo cambiarlo." },
  diferenciales: { title: "Aceite de los diferenciales del Mitsubishi Pajero III", description: "Tipo de aceite, capacidad y tapones de los diferenciales delantero y trasero del Pajero III." },
  frenos: { title: "Cambiar pastillas y purgar frenos del Mitsubishi Pajero III", description: "Cambio de pastillas delante y detrás del Pajero III, grosor mínimo, aprietes de pinza y orden de purga de los frenos." },
  ruedas: { title: "Par de apriete de las ruedas del Mitsubishi Pajero III", description: "Par de apriete de las tuercas de rueda y de la rueda de repuesto del Mitsubishi Pajero III." },
  direccion: { title: "Dirección del Mitsubishi Pajero III: holgura y aceite", description: "Líquido de la dirección asistida y holgura máxima del volante del Mitsubishi Pajero III." },
};

export const nivaSeo: Record<string, PartSeo> = {
  ficha: { title: "Ficha técnica motor Lada Niva 1600 (VAZ-2121)", description: "Datos del motor 1,6 del Lada Niva: aceite, refrigerante, holguras, encendido y presiones." },
  culata: { title: "Junta de culata Lada Niva: orden y par de apriete", description: "Cómo cambiar la junta de culata del Lada Niva 1600: orden de apriete de los 11 tornillos, pares y comprobaciones de la culata." },
  "prueba-culata": { title: "Probar la estanqueidad de la culata del Lada Niva", description: "Cómo comprobar si la culata del Lada Niva tiene fisuras o pierde: prueba de estanqueidad paso a paso." },
  distribucion: { title: "Tensar la cadena de distribución del Lada Niva 1600", description: "Cómo tensar la cadena de distribución del Lada Niva 1600 con su tensor de muelle y comprobar las marcas." },
  valvulas: { title: "Reglaje de válvulas del Lada Niva 1600", description: "Holgura de válvulas del Lada Niva en frío, numeración de levas y orden de reglaje con galga." },
  "pares-motor": { title: "Pares de apriete del motor del Lada Niva 1600", description: "Tabla de pares de apriete del motor VAZ-2121 del Lada Niva: culata, bielas, bancadas, volante y más." },
  pistones: { title: "Pistones y segmentos del Lada Niva 1600: medidas", description: "Medidas de pistones, segmentos y cilindros del Lada Niva 1600, clases y cómo montarlos." },
  ciguenal: { title: "Cigüeñal del Lada Niva 1600: juego axial y medidas", description: "Juego axial, medidas de muñequillas y casquillos del cigüeñal del Lada Niva 1600." },
  "montaje-distribucion": { title: "Montar la cadena de distribución del Lada Niva", description: "Cómo montar la cadena, el tensor y los piñones de la distribución del Lada Niva 1600 paso a paso." },
  "bomba-aceite": { title: "Bomba de aceite del Lada Niva 1600: holguras y montaje", description: "Holguras de la bomba de aceite del Lada Niva 2121, diferencias con la del 2101 y montaje." },
  cotas: { title: "Cotas de dirección y alineado del Lada Niva", description: "Convergencia, caída y avance del Lada Niva: valores y cómo ajustarlos." },
};
