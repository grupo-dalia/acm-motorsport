import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { catalog } from "@/integrations/commerce";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["/", "/motorsport", "/objetivo-dakar", "/workshop", "/sim-racing", "/tienda", "/contacto"].map((p) => ({
    url: absoluteUrl(p),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.8,
  }));
  // Los productos demo no se incluyen: solo productos reales a la venta.
  const products = (await catalog.listProducts())
    .filter((p) => !p.demo)
    .map((p) => ({ url: absoluteUrl(`/tienda/${p.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 }));
  return [...staticRoutes, ...products];
}
