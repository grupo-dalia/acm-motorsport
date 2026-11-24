/**
 * Textos de venta y SEO de cada producto de Printful, por slug (el slug sale del título en Printful).
 * Si un producto no está aquí, la ficha usa el texto genérico.
 */
export type ProductCopy = {
  tagline: string;
  description: string;
  details?: string[];
  tags?: string[];
};

const TEE = "Camiseta unisex Bella+Canvas 3001: algodón peinado de 145 g, suave y de corte actual";
const DTG = "Estampado directo (DTG) de alta resolución que aguanta lavados";
const HOODIE = "Sudadera con capucha unisex Cotton Heritage M2580: felpa gruesa con interior cepillado y bolsillo canguro";
const BACK = "Logo ACM Motorsport pequeño en el pecho y el diseño grande en la espalda";

export const productCopy: Record<string, ProductCopy> = {
  "camiseta-dunas-retro-4x4": {
    tagline: "Un 4x4 clásico volando sobre la duna con sol retro de los 80.",
    description:
      "Camiseta 4x4 con un todoterreno clásico saltando una duna delante de un sol a franjas estilo años 80. Para los que se pasan el finde en pistas, raids y arena, y para regalar a quien tiene el 4x4 más limpio por fuera que por dentro.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Rey de las dunas"],
    tags: ["camiseta 4x4", "camiseta todoterreno", "camiseta offroad", "regalo 4x4"],
  },
  "camiseta-vadeo-sin-miedo-4x4": {
    tagline: "Río, piedras y agua hasta el paragolpes. Sin puente, sin problema.",
    description:
      "Camiseta todoterreno con un 4x4 clásico cruzando un río entre salpicaduras, montañas y atardecer. Para los que miran el vadeo antes que el GPS y saben que el snorkel no es de adorno.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Vadeo sin miedo"],
    tags: ["camiseta 4x4", "camiseta vadeo", "camiseta offroad", "regalo todoterreno"],
  },
  "camiseta-no-bridge-needed-4x4": {
    tagline: "No bridge needed: el vadeo, en inglés.",
    description:
      "Versión en inglés de nuestro diseño de vadeo: un 4x4 clásico cruzando el río a lo bruto. Para llevarla en raids internacionales o porque en inglés todo suena más a película.",
    details: [TEE, DTG, "Diseño ACM Motorsport: No Bridge Needed"],
    tags: ["4x4 t-shirt", "offroad t-shirt", "camiseta 4x4 inglés"],
  },
  "camiseta-dune-king-4x4": {
    tagline: "Dune King: el rey de las dunas, versión en inglés.",
    description:
      "Camiseta offroad con un todoterreno clásico saltando la duna sobre un sol synthwave de los 80. Texto en inglés para los que van de raid a Marruecos y vuelven contándolo.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Dune King"],
    tags: ["4x4 t-shirt", "dune t-shirt", "camiseta desierto"],
  },
  "camiseta-sin-miedo-a-la-arena-4x4": {
    tagline: "Gas a fondo, arena volando y las cuatro ruedas en el aire.",
    description:
      "Camiseta 4x4 con un todoterreno de los 80 en pleno salto, sol retro y nube de arena. Para quien baja presión de ruedas antes de que se lo digan y sube la duna a la primera.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Sin miedo a la arena"],
    tags: ["camiseta 4x4", "camiseta dunas", "camiseta raid"],
  },
  "camiseta-send-it-4x4": {
    tagline: "Send it. Ya pensarás luego en la suspensión.",
    description:
      "Camiseta offroad con texto en inglés y un 4x4 clásico saltando la duna con sol synthwave. La filosofía de cualquier piloto resumida en dos palabras.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Send It"],
    tags: ["4x4 t-shirt", "send it", "camiseta offroad"],
  },
  "camiseta-ruta-al-atardecer-4x4": {
    tagline: "Insignia vintage: montaña, pinos y un 4x4 subiendo al atardecer.",
    description:
      "Camiseta de montaña y todoterreno con insignia circular estilo parque nacional: 4x4 clásico trepando entre rocas y pinos con el sol cayendo. Para rutas por pistas forestales, acampadas y escapadas sin cobertura.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Ruta al atardecer"],
    tags: ["camiseta 4x4 montaña", "camiseta overland", "camiseta ruta todoterreno"],
  },
  "camiseta-sunset-trail-4x4": {
    tagline: "Sunset Trail: la insignia de montaña, en inglés.",
    description:
      "Insignia vintage de overland con un 4x4 clásico entre montañas y pinos al atardecer, con texto en inglés. Ideal para los que viajan con tienda de techo y nevera de 12 V.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Sunset Trail"],
    tags: ["overland t-shirt", "4x4 t-shirt", "camiseta overland"],
  },
  "camiseta-mas-barro-menos-asfalto": {
    tagline: "Barro hasta el techo y una sonrisa de oreja a oreja.",
    description:
      "Camiseta offroad con un 4x4 clásico saliendo de un barrizal entre salpicaduras naranjas. Para los que lavan el coche una vez al año y por obligación, y para regalar a quien siempre elige la pista en vez de la autovía.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Más barro, menos asfalto"],
    tags: ["camiseta barro 4x4", "camiseta offroad", "regalo 4x4", "camiseta todoterreno"],
  },
  "camiseta-mud-over-asphalt-4x4": {
    tagline: "Mud over asphalt: la filosofía offroad, en inglés.",
    description:
      "Versión en inglés de nuestro diseño de barro: 4x4 clásico atravesando el lodo con todo. Para raids, quedadas y para el que tiene las alfombrillas del coche llenas de tierra de tres comunidades distintas.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Mud Over Asphalt"],
    tags: ["mud t-shirt", "offroad t-shirt", "4x4 t-shirt"],
  },
  "camiseta-sol-naciente-4x4": {
    tagline: "Estilo japonés ukiyo-e: olas, monte nevado y un 4x4 clásico.",
    description:
      "Camiseta 4x4 inspirada en los grabados japoneses: un todoterreno clásico rompiendo entre olas, con el monte nevado y el sol rojo detrás. Para fans de los 4x4 japoneses de los 80 y 90 que se saben de memoria el código de su motor.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Sol naciente 4x4"],
    tags: ["camiseta japonesa coche", "camiseta 4x4 japonés", "camiseta jdm 4x4"],
  },
  "camiseta-rising-sun-4x4": {
    tagline: "Rising Sun: el 4x4 entre olas japonesas, en inglés.",
    description:
      "Diseño estilo grabado japonés con un todoterreno clásico entre olas, monte nevado y sol rojo, con texto en inglés. Camiseta para los amantes de los 4x4 japoneses de toda la vida.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Rising Sun 4x4"],
    tags: ["jdm 4x4 t-shirt", "japanese car t-shirt", "camiseta japonesa 4x4"],
  },
  "camiseta-acm-street-racing-japan": {
    tagline: "ACM Street Racing Division, con katakana y sakura.",
    description:
      "Camiseta de la división Street Racing de ACM Motorsport: 4x4 clásico derrapando en plena ciudad japonesa con cerezos, monte nevado y letras en katakana. Estética JDM pura para los que mezclan offroad y cultura del motor japonesa.",
    details: [TEE, DTG, "Diseño ACM Motorsport: Street Racing Division"],
    tags: ["camiseta jdm", "camiseta street racing", "camiseta japonesa coche"],
  },
  "camiseta-ficha-tecnica-4x4": {
    tagline: "Plano técnico de un 4x4 clásico: vistas, cotas y despiece.",
    description:
      "Camiseta blanca con el plano técnico de un todoterreno clásico de 5 puertas: vista lateral, frontal, trasera y chasis, en azul plano y rojo. Para mecánicos, ingenieros y los que se saben de memoria los pares de apriete de su 4x4.",
    details: [TEE, DTG, "Mejor en colores claros", "Diseño ACM Motorsport: Ficha técnica 4x4"],
    tags: ["camiseta plano coche", "camiseta mecánico", "camiseta 4x4"],
  },
  "camiseta-4x4-blueprint": {
    tagline: "4x4 Blueprint: el plano técnico, en inglés.",
    description:
      "Plano técnico de un todoterreno clásico con vistas y cotas, versión con texto en inglés. Camiseta para taller, garaje y fans de la mecánica de verdad.",
    details: [TEE, DTG, "Mejor en colores claros", "Diseño ACM Motorsport: 4x4 Blueprint"],
    tags: ["blueprint t-shirt", "car blueprint", "camiseta plano 4x4"],
  },
  "camiseta-club-del-cambio-manual": {
    tagline: 'Club del Cambio: para los que no perdonan el tercer pedal.',
    description:
      'Camiseta para amantes del cambio manual: escudo retro con un pomo de 5 marchas entre laureles, cuadros de carreras y el lema «Nacidos para conducir». Para los que bajan marcha antes de la curva y miran raro a los coches automáticos.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Club del Cambio"],
    tags: ['camiseta cambio manual', 'camiseta coches', 'camiseta motor', 'regalo para conductores'],
  },
  "sudadera-club-del-cambio-manual": {
    tagline: 'Club del Cambio en sudadera: tres pedales y manga larga.',
    description:
      'Sudadera con capucha con el escudo del Club del Cambio a la espalda: pomo de 5 marchas, laureles y «Nacidos para conducir». Para quedadas, circuito en invierno o madrugones de tramo.',
    details: [HOODIE, DTG, BACK, "Diseño ACM Motorsport: Club del Cambio"],
    tags: ['sudadera cambio manual', 'sudadera coches', 'sudadera motor', 'regalo motero de coches'],
  },
  "camiseta-overland-division-4x4": {
    tagline: 'Overland Division: baca cargada, sol bajo y nada de prisa.',
    description:
      'Camiseta overland con un todoterreno clásico de 5 puertas con baca y equipaje, montañas y sol rojo. «Go far, stay dirty». Para viajeros 4x4, campistas de techo y los que miden las vacaciones en kilómetros de pista.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Overland Division"],
    tags: ['camiseta overland', 'camiseta 4x4', 'camiseta todoterreno', 'camiseta viaje 4x4'],
  },
  "sudadera-overland-division-4x4": {
    tagline: 'Overland Division para noches frías de acampada.',
    description:
      'Sudadera con capucha overland: todoterreno clásico con baca, montañas y sol rojo a la espalda, y logo ACM en el pecho. La que vas a llevar puesta junto al fuego cuando baje la temperatura en la sierra.',
    details: [HOODIE, DTG, BACK, "Diseño ACM Motorsport: Overland Division"],
    tags: ['sudadera overland', 'sudadera 4x4', 'sudadera todoterreno', 'regalo 4x4'],
  },
  "camiseta-beyond-the-road-4x4": {
    tagline: 'Beyond The Road: donde se acaba el asfalto empieza lo bueno.',
    description:
      'Camiseta 4x4 con un todoterreno clásico subiendo entre piedras, pinos y montañas, con el texto «Beyond The Road». Estilo outdoor para los que salen del camino marcado cada vez que pueden.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Beyond The Road"],
    tags: ['camiseta 4x4', 'camiseta offroad', '4x4 t-shirt', 'camiseta montaña'],
  },
  "camiseta-rey-del-barro-4x4": {
    tagline: 'Rey del Barro: polvo, golpes y gloria.',
    description:
      'Camiseta off-road con un 4x4 clásico salpicando barro entre montañas, con «Rey del Barro» y «Polvo, golpes y gloria». Para el que siempre vuelve de la ruta con el coche irreconocible y una sonrisa de oreja a oreja.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Rey del Barro"],
    tags: ['camiseta barro 4x4', 'camiseta offroad', 'camiseta todoterreno', 'regalo 4x4'],
  },
  "sudadera-rey-del-barro-4x4": {
    tagline: 'Rey del Barro en sudadera, para rutas de invierno.',
    description:
      'Sudadera con capucha con el 4x4 cubierto de barro y el lema «Polvo, golpes y gloria» a la espalda. Para rutas de invierno, salidas de club y para mancharla sin miedo.',
    details: [HOODIE, DTG, BACK, "Diseño ACM Motorsport: Rey del Barro"],
    tags: ['sudadera 4x4', 'sudadera offroad', 'sudadera barro', 'regalo todoterreno'],
  },
  "camiseta-racing-culture-acm": {
    tagline: 'Racing Culture: cars, people, passion.',
    description:
      'Camiseta motorsport con tipografía grande «Racing Culture», cuadros de meta y el logo ACM Motorsport. Para los que viven las carreras de coches dentro y fuera de la pista.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Racing Culture"],
    tags: ['camiseta racing', 'camiseta motorsport', 'camiseta carreras', 'racing t-shirt'],
  },
  "sudadera-racing-culture-acm": {
    tagline: 'Racing Culture en sudadera para el paddock.',
    description:
      'Sudadera con capucha «Racing Culture» con cuadros de meta y logo ACM. Para el paddock, el circuito en invierno o el sofá viendo el rally de madrugada.',
    details: [HOODIE, DTG, BACK, "Diseño ACM Motorsport: Racing Culture"],
    tags: ['sudadera racing', 'sudadera motorsport', 'sudadera carreras', 'racing hoodie'],
  },
  "camiseta-gasolina-en-las-venas": {
    tagline: 'Gasolina en las venas: no tiene cura y tampoco la buscamos.',
    description:
      'Camiseta para quemados del motor con «Gasolina en las venas» en letra de pincel roja y crema con cuadros de carreras. Regalo fácil para el que habla de coches en todas las comidas familiares.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Gasolina en las venas"],
    tags: ['camiseta gasolina', 'camiseta motor', 'camiseta coches', 'regalo amante coches'],
  },
  "sudadera-gasolina-en-las-venas": {
    tagline: 'Gasolina en las venas, ahora con capucha.',
    description:
      'Sudadera con capucha «Gasolina en las venas» a la espalda y logo ACM en el pecho. Para los que huelen a gasolina hasta cuando salen de la ducha.',
    details: [HOODIE, DTG, BACK, "Diseño ACM Motorsport: Gasolina en las venas"],
    tags: ['sudadera gasolina', 'sudadera motor', 'sudadera coches', 'regalo motor'],
  },
  "camiseta-mas-gas-menos-drama": {
    tagline: 'Más gas, menos drama.',
    description:
      'Camiseta de humor motero-coche con «Más gas, menos drama» en tipografía de pincel. Filosofía de vida resumida en cuatro palabras: si hay un problema, se pisa y se sigue.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Más gas, menos drama"],
    tags: ['camiseta graciosa coches', 'camiseta motor', 'camiseta gas', 'regalo original coches'],
  },
  "camiseta-la-calle-es-mi-circuito": {
    tagline: 'La calle es mi circuito (dentro de la ley, eh).',
    description:
      'Camiseta street racing con «La calle es mi circuito», franjas rojas, cuadros de meta y texto en japonés. Estética de cultura de coches callejera para quedadas y concentraciones.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: La calle es mi circuito"],
    tags: ['camiseta street racing', 'camiseta coches', 'camiseta jdm', 'camiseta tuning'],
  },
  "camiseta-no-es-ruido-es-musica": {
    tagline: 'No es ruido, es música.',
    description:
      'Camiseta para los que suben el escape y bajan la radio: «No es ruido, es música» en letras grandes con cuadros de carreras. Ideal para regalar a quien defiende su escape en cada comunidad de vecinos.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: No es ruido, es música"],
    tags: ['camiseta escape', 'camiseta motor', 'camiseta graciosa coches', 'regalo coches'],
  },
  "camiseta-built-not-bought": {
    tagline: 'Built not bought: late nights, dirty hands.',
    description:
      'Camiseta de taller con llave fija y biela cruzadas y el lema «Built Not Bought». Para los que montan su coche pieza a pieza en el garaje, de noche y con las manos negras.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Built Not Bought"],
    tags: ['camiseta mecánico', 'camiseta taller', 'camiseta garaje', 'built not bought t-shirt'],
  },
  "camiseta-save-the-manuals": {
    tagline: 'Save the manuals: three pedals, full soul.',
    description:
      'Camiseta «Save The Manuals – Three pedals. Full soul.» para defensores del cambio manual en plena era del automático y el eléctrico. En inglés para que se entienda en cualquier quedada.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Save The Manuals"],
    tags: ['save the manuals', 'camiseta cambio manual', 'manual transmission t-shirt', 'camiseta coches'],
  },
  "camiseta-eat-sleep-race-repeat": {
    tagline: 'Eat, sleep, race, repeat.',
    description:
      'Camiseta motorsport con el clásico «Eat Sleep Race Repeat» en tipografía grande, con «Race» en rojo y logo ACM Motorsport. Para pilotos de rally, karting, circuito o simulador.',
    details: [TEE, DTG, BACK, "Diseño ACM Motorsport: Eat Sleep Race Repeat"],
    tags: ['eat sleep race repeat', 'camiseta racing', 'camiseta piloto', 'regalo piloto'],
  },
};
