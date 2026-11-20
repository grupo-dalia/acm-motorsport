import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { jobPath } from "@/content/manual-types";
import { catalog } from "@/integrations/commerce";
import { getArticles } from "@/lib/news";
import { nivaManual, pajeroManual, pajeroManualEn } from "@/content/manual-defs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["/", "/motorsport", "/objetivo-dakar", "/workshop", "/sim-racing", "/guias", "/guias/manual-pajero-iii", "/guias/manual-lada-niva", "/noticias", "/starlink", "/tienda", "/tienda/recambios", "/descuentos", "/contacto", "/en/manuals", "/en/manuals/mitsubishi-pajero-4d56"].map((p) => ({
    url: absoluteUrl(p),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.8,
  }));
  // Los productos demo no se incluyen: solo productos reales a la venta.
  const products = (await catalog.listProducts())
    .filter((p) => !p.demo)
    .map((p) => ({ url: absoluteUrl(`/tienda/${p.slug}`), lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 }));
  const news = (await getArticles())
    .filter((a) => !a.draft)
    .map((a) => ({ url: absoluteUrl(`/noticias/${a.slug}`), lastModified: a.updated ?? a.date, changeFrequency: "monthly" as const, priority: 0.7 }));
  const manualJobs = [pajeroManual, nivaManual, pajeroManualEn].flatMap((m) =>
    m.systems.flatMap((s) => s.parts.map((p) => ({ url: absoluteUrl(jobPath(m.vehicle, p.id)), lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }))),
  );
  return [...staticRoutes, ...manualJobs, ...news, ...products];
}
