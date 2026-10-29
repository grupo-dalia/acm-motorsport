"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const DunesScene = dynamic(() => import("./dunes-scene"), { ssr: false });

/** Bloque a sangre con dunas 3D detrás. Solo renderiza mientras está en pantalla. */
export function DunesHero({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (reduce || !el) return;
    const io = new IntersectionObserver(([e]) => {
      setActive(Boolean(e?.isIntersecting));
      if (e?.isIntersecting) setEnabled(true);
    }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={cn("relative isolate overflow-hidden bg-[linear-gradient(180deg,#081221_0%,#0d1a33_45%,#16294b_70%,#101e36_100%)]", className)}>
      <div className="pointer-events-none absolute left-[74%] top-[22%] -z-10 size-16 rounded-full bg-[radial-gradient(circle,#f3f6fd_0%,#dbe4f7_55%,rgba(219,228,247,0)_72%)] sm:size-20" aria-hidden />
      <div className="pointer-events-none absolute left-[74%] top-[22%] -z-10 size-16 scale-[6] rounded-full sm:size-20 bg-[radial-gradient(circle,rgba(120,150,220,0.25)_0%,rgba(120,150,220,0)_60%)] sm:size-36" aria-hidden />
      {enabled && (
        <div className="absolute inset-0 -z-10">
          <DunesScene active={active} />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-midnight-deep to-transparent" aria-hidden />
      {children}
    </div>
  );
}
