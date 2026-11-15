"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type ManualCard = { href: string; brand: string; model: string; meta: string; engine: string; jobs: number; photo?: { src: string; alt: string } };

/** Fila «Manuales de taller» del catálogo de guías: misma pinta que las filas de guías, con filtro por marca. */
export function ManualRow({ cards }: { cards: ManualCard[] }) {
  const brands = [...new Set(cards.map((c) => c.brand))].sort();
  const [brand, setBrand] = useState<string | null>(null);
  const shown = brand ? cards.filter((c) => c.brand === brand) : cards;
  const chip = (on: boolean) => cn("rounded-full border px-4 py-1.5 text-sm font-medium transition-colors", on ? "border-racing bg-racing text-paper" : "border-paper/25 hover:border-paper/60");

  return (
    <section aria-labelledby="fila-manuales" className="mb-16">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id="fila-manuales" className="t-title">Manuales de taller</h2>
        <p className="t-small opacity-60">{cards.length} {cards.length === 1 ? "coche" : "coches"} · paso a paso con aprietes</p>
      </div>
      <p className="mt-2 max-w-[60ch] opacity-70">Elige tu coche: datos, pares de apriete y cada trabajo paso a paso, en modo taller.</p>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por marca">
        <button type="button" onClick={() => setBrand(null)} aria-pressed={brand === null} className={chip(brand === null)}>Todas</button>
        {brands.map((b) => (
          <button key={b} type="button" onClick={() => setBrand(b)} aria-pressed={brand === b} className={chip(brand === b)}>{b}</button>
        ))}
      </div>
      <ul className="-mx-5 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0">
        {shown.map((c) => (
          <li key={c.href} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]">
            <Link href={c.href} className="group block">
              <div className="relative aspect-[16/9] overflow-hidden rounded-[6px] bg-surface">
                {c.photo && <Image src={c.photo.src} alt={c.photo.alt} fill sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 78vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />}
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-midnight/85 via-midnight/10 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-racing px-3 py-1 text-sm font-semibold text-paper">{c.brand}</span>
                <span className="absolute bottom-3 left-3 rounded-full bg-midnight/85 px-3 py-1 text-sm font-semibold">{c.jobs} trabajos</span>
              </div>
              <p className="mt-4 font-semibold leading-snug group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">Manual de taller {c.model}</p>
              <p className="mt-1 t-small opacity-60">{c.meta} · {c.engine}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
