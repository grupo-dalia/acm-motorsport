import Link from "next/link";
import Image from "next/image";
import { coverOf, type Article } from "@/lib/news";
import { newsCategories } from "@/lib/news-categories";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ArticleCard({ a, large = false, className, headingLevel = 3 }: { a: Article; large?: boolean; className?: string; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const cover = coverOf(a);
  return (
    <article className={cn("group", className)}>
      <Link href={`/noticias/${a.slug}`} className={cn("block", large && cover && "lg:grid lg:grid-cols-12 lg:items-center lg:gap-10")}>
        {cover && (
          <div className={cn("relative aspect-[16/9] overflow-hidden rounded-[6px] bg-mist", large && "lg:col-span-7")}>
            <Image src={cover} alt={a.imageAlt ?? ""} fill priority={large} sizes={large ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"} className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          </div>
        )}
        <div className={cn(cover ? "pt-5" : "border-t border-current/15 pt-6", large && cover && "lg:col-span-5 lg:pt-0")}>
          <p className="t-small opacity-60">
            {newsCategories[a.category]} · <time dateTime={a.date.toISOString()}>{formatDate(a.date.toISOString(), { day: "numeric", month: "short", year: "numeric" })}</time>
            {a.draft && <span className="ml-2 text-racing">Borrador</span>}
          </p>
          <H className={cn("mt-3 group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4", large ? "t-display" : "t-sub")}>{a.title}</H>
          <p className="mt-3 max-w-[60ch] opacity-70">{a.summary}</p>
          <p className="mt-4 t-small opacity-60">{a.readingMinutes} min de lectura</p>
        </div>
      </Link>
    </article>
  );
}
