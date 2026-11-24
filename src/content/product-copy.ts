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
};
