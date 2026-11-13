import Link from "next/link";
import Image from "next/image";
import { coverOf, type Article } from "@/lib/news";
import type { GuideCollection } from "@/content/guides";

/** Fila del catálogo de guías: carrusel horizontal con scroll nativo, tipo plataforma de streaming. */
export function GuideRow({ collection, guides, headingLevel = 2 }: { collection: GuideCollection; guides: Article[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const total = guides.length + collection.upcoming.length;
  if (!total) return null;
  return (
    <section aria-labelledby={`fila-${collection.id}`} className="mt-16 first:mt-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <H id={`fila-${collection.id}`} className="t-title">{collection.title}</H>
        <p className="t-small opacity-60">{guides.length} {guides.length === 1 ? "guía" : "guías"}{collection.upcoming.length > 0 && ` · ${collection.upcoming.length} en camino`}</p>
      </div>
      <p className="mt-2 max-w-[60ch] opacity-70">{collection.lead}</p>
      <ul className="-mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
        {guides.map((g, i) => {
          const cover = coverOf(g);
          return (
            <li key={g.slug} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
              <Link href={`/noticias/${g.slug}`} className="group block">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[6px] bg-surface">
                  {cover && <Image src={cover} alt={g.imageAlt ?? ""} fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />}
                  <span className="absolute left-3 top-3 rounded-full bg-midnight/85 px-3 py-1 text-sm font-semibold">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-4 font-semibold leading-snug group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">{g.title}</p>
                <p className="mt-1 t-small opacity-60">{g.readingMinutes} min de lectura</p>
              </Link>
            </li>
          );
        })}
        {collection.upcoming.map((t) => (
          <li key={t} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]" aria-label={`Próximamente: ${t}`}>
            <div className="flex aspect-[16/9] items-end rounded-[6px] border border-dashed border-paper/25 p-4">
              <span className="rounded-full border border-paper/30 px-3 py-1 text-sm font-medium opacity-80">Próximamente</span>
            </div>
            <p className="mt-4 font-semibold leading-snug opacity-70">{t}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
