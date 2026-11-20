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

/** English: Pajero is sold as Montero (Spain, Americas) and Shogun (UK); the 4D56 also powers the L200 and Delica. */
export const pajeroSeoEn: Record<string, PartSeo> = {
  ficha: { title: "Mitsubishi 4D56 2.5 TD engine specs (Pajero / Montero III)", description: "4D56 2.5 TD data for the Pajero III / Montero / Shogun (2001-2002): displacement, compression, valve timing, oil, capacities and main torque settings." },
  "correa-auxiliar": { title: "Pajero III 2.5 TD (4D56) accessory belt replacement", description: "How to check, remove and fit the serpentine belt and the A/C belt on the Mitsubishi Pajero III / Montero 2.5 TD, with the Allen key trick for the tensioner." },
  distribucion: { title: "Pajero 2.5 TD 4D56 timing belt replacement: marks and torques", description: "Step by step timing belt and balance shaft belt (belt B) replacement on the Mitsubishi Pajero / Montero / Shogun 2.5 TD 4D56: timing marks, routing, tensioners and torques." },
  "tension-distribucion": { title: "How to tension the 4D56 timing belt (Pajero 2.5 TD)", description: "Re-tension the main belt and belt B on the Pajero III 4D56 without removing them: bolt order, correct deflection and common mistakes." },
  valvulas: { title: "4D56 valve clearance: Mitsubishi Pajero 2.5 TD", description: "4D56 hot valve clearance, which valves to set with cylinder 1 and cylinder 4 at TDC, and how to close the rocker cover without leaks." },
  "arbol-levas": { title: "Pajero 2.5 TD (4D56) camshaft seal replacement", description: "Removing and fitting the camshaft and its oil seal on the Pajero III 4D56 without losing the timing: cap numbers, torques and seal depth." },
  culata: { title: "Pajero III 2.5 TD head gasket: 4D56 head bolt torque and sequence", description: "Changing the 4D56 head gasket on the Pajero III / Montero: loosening and tightening order of the 18 bolts, 2001 and 2002 torque, and how to choose gasket thickness." },
  aceite: { title: "Mitsubishi Pajero 2.5 TD (4D56) oil capacity and oil change", description: "Which oil the Pajero III 2.5 TD takes, how many litres with the filter, drain plug torque and how to read the dipstick." },
  carter: { title: "Pajero III 2.5 TD (4D56) oil sump removal and sealing", description: "How to remove and seal the 4D56 sump on the Pajero III: what has to come off, where the sealant bead goes and torques." },
  "retenes-ciguenal": { title: "4D56 crankshaft oil seals: Pajero 2.5 TD front and rear", description: "Front and rear crankshaft seals on the Pajero III 4D56: how to remove them, fit them with their guide, and flywheel torque." },
  refrigeracion: { title: "Pajero III 2.5 TD (4D56) water pump and thermostat", description: "Change the coolant, thermostat and water pump on the Mitsubishi Pajero / Montero 2.5 TD: capacity, drain plugs and the size of every bolt." },
  gasoil: { title: "Bleed the fuel system and change the filter: Pajero 2.5 TD (4D56)", description: "How to drain water from the fuel filter, bleed the air and test the injectors on the Mitsubishi Pajero III 2.5 TD." },
  "bomba-inyectora": { title: "4D56 injection pump timing: Mitsubishi Pajero 2.5 TD", description: "How to check and set injection pump timing on the Pajero III / Montero 2.5 TD (2001 engine, mechanical pump) with a dial gauge, and how to set idle speed." },
  turbo: { title: "Pajero III 2.5 TD turbo: boost pressure and wastegate test", description: "How to measure 4D56 boost, test the wastegate actuator and remove the turbo on the Mitsubishi Pajero III 2.5 TD." },
  calentadores: { title: "How to test the glow plugs on a Mitsubishi Pajero 2.5 TD (4D56)", description: "Testing the Pajero III 4D56 glow plugs with a multimeter, plus alternator and charging data." },
  compresion: { title: "4D56 compression test: Mitsubishi Pajero 2.5 TD", description: "How to measure 4D56 compression on the Pajero III: which connector to unplug, normal and minimum values and maximum difference between cylinders." },
  embrague: { title: "Mitsubishi Pajero III 2.5 TD clutch: specs and adjustment", description: "Pajero III 2.5 TD clutch data: type, hydraulic release and fluid." },
  "caja-reductora": { title: "Pajero III gearbox and transfer case oil", description: "Which oil and how much goes in the Mitsubishi Pajero III 2.5 TD gearbox and transfer case, and how to change it." },
  diferenciales: { title: "Mitsubishi Pajero III differential oil", description: "Oil type, capacity and plugs for the Pajero III front and rear differentials." },
  frenos: { title: "Mitsubishi Pajero III brake pads and brake bleeding", description: "Front and rear brake pad replacement on the Pajero III, minimum thickness, caliper torques and bleeding order." },
  ruedas: { title: "Mitsubishi Pajero III wheel nut torque", description: "Wheel nut and spare wheel torque for the Mitsubishi Pajero III." },
  direccion: { title: "Mitsubishi Pajero III steering: play and fluid", description: "Power steering fluid and maximum steering wheel play on the Mitsubishi Pajero III." },
};
