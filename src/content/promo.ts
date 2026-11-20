/**
 * Banner promocional de la web. Las camisetas salen recortadas de public/promo/.
 * Para una camiseta nueva: deja sus PNG recortados ahí y añádela a `promoShirts`.
 */
export type PromoShirt = { slug: string; name: string; images: string[] };

export const promoShirts: PromoShirt[] = [
  { slug: "camiseta-sin-plomo-98", name: "Sin Plomo 98", images: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `/promo/sinplomo-${i}.webp`) },
  { slug: "camiseta-suprimo", name: "Suprimo", images: ["/promo/suprimo-1.webp"] },
];
