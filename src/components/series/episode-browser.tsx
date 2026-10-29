"use client";

import { useEffect, useRef, useState } from "react";
import type { Season } from "@/lib/series";
import { usePlayer } from "./player-modal";
import { formatViews, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

function Thumb({ id, alt }: { id: string; alt: string }) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  return (
    // eslint-disable-next-line @next/next/no-img-element -- miniatura de YouTube con fallback
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={(e) => (src.includes("hqdefault") ? (e.currentTarget.style.visibility = "hidden") : setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`))}
      onLoad={(e) => e.currentTarget.naturalWidth <= 120 && setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}

/** Selector de temporada + lista de capítulos. */
export function EpisodeBrowser({ seasons }: { seasons: Season[] }) {
  const [current, setCurrent] = useState(seasons[0]?.number ?? 1);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { play } = usePlayer();
  const season = seasons.find((s) => s.number === current) ?? seasons[0]!;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !menuRef.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const released = season.episodes.filter((e) => e.status === "disponible" && e.number > 0).length;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="episodios-title" className="t-title">Capítulos</h2>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={open}
            className="flex h-12 min-w-56 items-center justify-between gap-4 rounded-[var(--radius-btn)] border border-paper/25 bg-surface px-4 font-medium hover:border-paper/60"
          >
            Temporada {season.number}
            <svg viewBox="0 0 10 6" className={cn("w-2.5 transition-transform", open && "rotate-180")} aria-hidden><path d="M0 0l5 6 5-6z" fill="currentColor" /></svg>
          </button>
          {open && (
            <ul role="listbox" aria-label="Temporadas" className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-[6px] border border-paper/15 bg-surface py-1 shadow-2xl shadow-black/60">
              {seasons.map((s) => (
                <li key={s.number}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={s.number === current}
                    onClick={() => { setCurrent(s.number); setOpen(false); }}
                    className={cn("flex w-full items-baseline justify-between gap-4 px-4 py-3 text-left hover:bg-paper/8", s.number === current && "bg-paper/10")}
                  >
                    <span className="whitespace-nowrap font-medium">Temporada {s.number}</span>
                    <span className="t-small text-steel">{s.status === "proximamente" ? `Próximamente · ${s.year}` : `${s.year} · ${s.episodes.filter((e) => e.status === "disponible").length} cap.`}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-steel">
        <span className="font-medium text-paper">{season.title}</span>
        <span>{season.year}</span>
        {season.status === "emision" && <span>{released} de {season.totalEpisodes} capítulos</span>}
      </div>
      <p className="mt-3 max-w-[64ch] text-paper/70">{season.synopsis}</p>

      {season.status === "proximamente" ? (
        <div className="mt-12 grid min-h-64 place-items-center rounded-[8px] border border-paper/10 bg-[linear-gradient(160deg,#111722,#0b0f17)] p-10 text-center">
          <div>
            <p className="t-display tnum">{season.year}</p>
            <p className="mt-3 text-paper/70">Próximamente. Suscríbete al canal para no perderte el estreno.</p>
          </div>
        </div>
      ) : (
        <ol className="mt-10 divide-y divide-paper/10 border-y border-paper/10">
          {season.episodes.map((ep) => {
            const available = ep.status === "disponible" && ep.youtubeId;
            const meta = [ep.duration, formatViews(ep.views), ep.publishedAt ? timeAgo(ep.publishedAt) : null].filter(Boolean).join(" · ");
            const Row = available ? "button" : "div";
            return (
              <li key={ep.number}>
                <Row
                  {...(available ? { type: "button" as const, onClick: () => play(ep.youtubeId!, ep.number === 0 ? `Piloto · ${ep.title}` : `T${ep.season}:E${ep.number} · ${ep.title}`) } : {})}
                  className={cn(
                    "group grid w-full grid-cols-[2rem_8.5rem_1fr] items-center gap-4 py-5 text-left sm:grid-cols-[3rem_15rem_1fr] sm:gap-6 sm:py-6",
                    available ? "cursor-pointer" : "cursor-default",
                    ep.status === "proximamente" && "opacity-55",
                  )}
                  aria-label={available ? `Reproducir ${ep.number === 0 ? "capítulo piloto" : `capítulo ${ep.number}`}: ${ep.title}` : undefined}
                >
                  <span className={cn("tnum text-center text-steel", ep.number === 0 ? "t-small font-medium uppercase tracking-wide [writing-mode:vertical-rl] rotate-180 mx-auto" : "t-title")}>{ep.number === 0 ? "Piloto" : ep.number}</span>
                  <span className="relative block aspect-video overflow-hidden rounded-[4px] bg-[linear-gradient(160deg,#1a2c4d,#0c1729)]">
                    {ep.youtubeId && <Thumb id={ep.youtubeId} alt="" />}
                    {available ? (
                      <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors group-hover:bg-ink/40">
                        <span className="grid size-11 scale-90 place-items-center rounded-full border border-paper/80 bg-ink/50 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                          <svg viewBox="0 0 12 14" className="ml-0.5 size-4" aria-hidden><path d="M0 0l12 7-12 7z" fill="currentColor" /></svg>
                        </span>
                      </span>
                    ) : (
                      <span className="absolute inset-0 grid place-items-center t-small font-medium text-paper/80">{ep.status === "proximamente" ? "Próximamente" : "Pendiente de enlazar"}</span>
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="t-sub">{ep.title}</span>
                      {ep.status === "proximamente" && <span className="rounded-full bg-paper/10 px-2.5 py-0.5 t-small">Próximamente</span>}
                    </span>
                    {(meta || ep.number === 0) && <span className="mt-1 block t-small text-steel">{[ep.number === 0 ? "Capítulo piloto" : null, meta].filter(Boolean).join(" · ")}</span>}
                    <span className="mt-2 line-clamp-2 hidden text-paper/65 sm:block">{ep.synopsis}</span>
                  </span>
                </Row>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
