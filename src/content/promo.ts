/**
 * Banner promocional de la web. Las camisetas salen recortadas de public/promo/.
 * Para una camiseta nueva: deja sus PNG recortados ahí y añádela a `promoShirts`.
 */
/**
 * `photo: true` → tarjeta destacada en blanco con la foto del producto de Printful (sin recorte propio).
 * `pill` cambia la etiqueta de la tarjeta.
 */
export type PromoShirt = { slug: string; name: string; images: string[]; photo?: boolean; pill?: string };

export const promoShirts: PromoShirt[] = [
  { slug: "f-alonso-world-champions", name: "Blue Era", images: [], photo: true, pill: "Destacada" },
  { slug: "camiseta-sin-plomo-98", name: "Sin Plomo 98", images: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `/promo/sinplomo-${i}.webp`) },
  { slug: "camiseta-suprimo", name: "Suprimo", images: ["/promo/suprimo-1.webp"] },
];

/** Camisetas que se recomiendan siempre en las fichas de producto ("Te puede gustar"). */
export const pinnedRecommendations = ["f-alonso-world-champions"];
