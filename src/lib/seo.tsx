import type { Metadata } from "next";
import { site } from "@/content/site";
import { absoluteUrl } from "./site";
import type { Product } from "@/domain/catalog";

export function pageMetadata({ title, description, path, image }: { title: string; description: string; path: string; image?: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: `${title} · ${site.name}`,
      description,
      url: absoluteUrl(path),
      siteName: site.name,
      locale: site.locale,
      type: "website",
      images: [{ url: image ?? "/opengraph-image", width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
    },
    twitter: { card: "summary_large_image", title: `${title} · ${site.name}`, description, images: [image ? image.replace(/opengraph-image$/, "twitter-image") : "/twitter-image"] },
  };
}

/** Serializa JSON-LD escapando "<" para evitar inyección en <script>. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: site.name,
    sport: "Rally raid",
    url: absoluteUrl("/"),
    description: site.description,
    founder: { "@type": "Person", name: site.founder },
    sameAs: site.social.map((s) => s.href),
  };
}

export function personLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.founder,
    jobTitle: "Piloto de rally todoterreno y creador de contenido",
    url: absoluteUrl("/motorsport"),
    sameAs: site.social.map((s) => s.href),
    memberOf: { "@type": "SportsTeam", name: site.name },
  };
}

export function breadcrumbLd(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.label, item: absoluteUrl(it.href) })),
  };
}

/** Product JSON-LD. Sin valoraciones: no existen reseñas reales todavía. Los productos demo no emiten oferta. */
export function productLd(p: Product) {
  const base = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    sku: p.variants[0]?.sku,
    brand: { "@type": "Brand", name: site.name },
    url: absoluteUrl(`/tienda/${p.slug}`),
  };
  if (p.demo || p.fulfillment === "affiliate") return base;
  return {
    ...base,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (p.priceCents / 100).toFixed(2),
      availability: p.variants.some((v) => v.available) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: absoluteUrl(`/tienda/${p.slug}`),
    },
  };
}

/** VideoObject para resultados enriquecidos de Google (solo vídeos reales). */
export function videoListLd(videos: { id: string; title: string; description: string; publishedAt: string; thumbnail: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: videos.map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        description: v.description || v.title,
        thumbnailUrl: [v.thumbnail],
        uploadDate: v.publishedAt,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
        url: `https://www.youtube.com/watch?v=${v.id}`,
      },
    })),
  };
}
