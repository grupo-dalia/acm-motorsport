"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

type Playing = { id: string; title: string } | null;
const Ctx = createContext<{ play: (id: string, title: string) => void } | null>(null);

function host() {
  try {
    const raw = window.localStorage.getItem("acm.consent.v1");
    return raw && JSON.parse(raw).marketing ? "www.youtube.com" : "www.youtube-nocookie.com";
  } catch {
    return "www.youtube-nocookie.com";
  }
}

/** Reproductor a pantalla completa tipo plataforma. La reproducción la inicia el usuario (cuenta en YouTube). */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const [playing, setPlaying] = useState<Playing>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const play = useCallback((id: string, title: string) => setPlaying({ id, title }), []);

  useEffect(() => {
    if (!playing) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPlaying(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [playing]);

  return (
    <Ctx.Provider value={{ play }}>
      {children}
      <AnimatePresence>
        {playing && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={playing.title}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-4 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPlaying(null)}
          >
            <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between gap-4 text-paper">
                <p className="t-sub truncate">{playing.title}</p>
                <button ref={closeRef} type="button" onClick={() => setPlaying(null)} className="shrink-0 rounded-full bg-paper/10 px-4 py-2 font-medium hover:bg-paper/20">Cerrar</button>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-[6px] bg-black">
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://${host()}/embed/${playing.id}?autoplay=1&rel=0&playsinline=1`}
                  title={playing.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer fuera de PlayerProvider");
  return c;
}

export function PlayButton({ id, title, label, className }: { id: string | null; title: string; label: string; className?: string }) {
  const { play } = usePlayer();
  if (!id) return <span className={className} aria-disabled>{label}</span>;
  return (
    <button type="button" onClick={() => play(id, title)} className={className}>
      <svg viewBox="0 0 12 14" className="size-4" aria-hidden><path d="M0 0l12 7-12 7z" fill="currentColor" /></svg>
      {label}
    </button>
  );
}
