import { getArticles } from "@/lib/news";
import { absoluteUrl } from "@/lib/site";
import { site } from "@/content/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function GET() {
  const items = (await getArticles()).filter((a) => !a.draft).slice(0, 30);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(site.name)} · Noticias</title><link>${absoluteUrl("/noticias")}</link><description>${esc(site.description)}</description><language>es-ES</language>
${items.map((a) => `<item><title>${esc(a.title)}</title><link>${absoluteUrl(`/noticias/${a.slug}`)}</link><guid>${absoluteUrl(`/noticias/${a.slug}`)}</guid><pubDate>${a.date.toUTCString()}</pubDate><description>${esc(a.summary)}</description></item>`).join("\n")}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "s-maxage=3600" } });
}
