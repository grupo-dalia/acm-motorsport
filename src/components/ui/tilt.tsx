"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Inclinación 3D con reflejo que sigue al ratón. Solo con puntero fino; en táctil no hace nada. */
export function Tilt({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    ref.current.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
    ref.current.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
    ref.current.style.setProperty("--gx", `${x * 100}%`);
    ref.current.style.setProperty("--gy", `${y * 100}%`);
    ref.current.dataset.active = "true";
  }
  function leave() {
    if (!ref.current) return;
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
    ref.current.dataset.active = "false";
  }
  return (
    <div className="[perspective:900px]">
      <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={cn("tilt relative", className)}>
        {children}
        <div className="tilt-glare pointer-events-none absolute inset-0" aria-hidden />
      </div>
    </div>
  );
}
