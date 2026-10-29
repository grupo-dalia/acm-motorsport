import Link from "next/link";
import type { Article } from "@/lib/news";
import { newsCategories } from "@/lib/news-categories";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ArticleCard({ a, large = false, className }: { a: Article; large?: boolean; className?: string }) {
  return (
    <article className={cn("group border-t border-current/15 pt-6", className)}>
      <Link href={`/noticias/${a.slug}`} className="block">
        <p className="t-small opacity-60">
          {newsCategories[a.category]} · <time dateTime={a.date.toISOString()}>{formatDate(a.date.toISOString(), { day: "numeric", month: "short", year: "numeric" })}</time>
          {a.draft && <span className="ml-2 text-racing">Borrador</span>}
        </p>
        <h3 className={cn("mt-3 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4", large ? "t-title" : "t-sub")}>{a.title}</h3>
        <p className="mt-3 max-w-[60ch] opacity-70">{a.summary}</p>
        <p className="mt-4 t-small opacity-60">{a.readingMinutes} min de lectura</p>
      </Link>
    </article>
  );
}
