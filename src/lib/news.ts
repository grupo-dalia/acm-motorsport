import "server-only";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { z } from "zod";

/**
 * Noticias y guías en Markdown (carpeta /content/news). Cada archivo = un artículo.
 * Dentro del texto se pueden insertar bloques:
 *   {{video:ID_DE_YOUTUBE}}   {{affiliate:starlink}}   {{product:slug-del-producto}}
 */
const DIR = join(process.cwd(), "content/news");

import { newsCategories } from "./news-categories";
export { newsCategories };

const schema = z.object({
  title: z.string().min(5),
  summary: z.string().min(20).max(220),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  category: z.enum(Object.keys(newsCategories) as [keyof typeof newsCategories, ...(keyof typeof newsCategories)[]]),
  draft: z.boolean().default(false),
  youtubeId: z.string().regex(/^[\w-]{11}$/).optional(),
  sources: z.array(z.object({ title: z.string(), url: z.url() })).default([]),
  tags: z.array(z.string()).default([]),
});

export type Block = { type: "html"; html: string } | { type: "video" | "affiliate" | "product"; id: string };
export type Article = z.infer<typeof schema> & { slug: string; readingMinutes: number; blocks: Block[] };

const SHORTCODE = /\{\{\s*(video|affiliate|product):([\w-]+)\s*\}\}/g;

function toBlocks(md: string): Block[] {
  const blocks: Block[] = [];
  let last = 0;
  for (const m of md.matchAll(SHORTCODE)) {
    const before = md.slice(last, m.index);
    if (before.trim()) blocks.push({ type: "html", html: marked.parse(before, { async: false }) });
    blocks.push({ type: m[1] as "video" | "affiliate" | "product", id: m[2]! });
    last = m.index! + m[0].length;
  }
  const rest = md.slice(last);
  if (rest.trim()) blocks.push({ type: "html", html: marked.parse(rest, { async: false }) });
  return blocks;
}

let cache: Promise<Article[]> | null = null;

async function load(): Promise<Article[]> {
  const files = (await readdir(DIR).catch(() => [])).filter((f) => f.endsWith(".md"));
  const all = await Promise.all(
    files.map(async (f) => {
      const raw = await readFile(join(DIR, f), "utf8");
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        console.warn(`[news] ${f} ignorado: ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}`);
        return null;
      }
      const words = content.split(/\s+/).length;
      return { ...parsed.data, slug: f.replace(/\.md$/, ""), readingMinutes: Math.max(1, Math.round(words / 220)), blocks: toBlocks(content) };
    }),
  );
  const showDrafts = process.env.NODE_ENV !== "production";
  return all
    .filter((a): a is Article => a !== null && (showDrafts || !a.draft))
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getArticles() {
  if (process.env.NODE_ENV !== "production") return load();
  cache ??= load();
  return cache;
}

export async function getArticle(slug: string) {
  return (await getArticles()).find((a) => a.slug === slug) ?? null;
}
