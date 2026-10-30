"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

const GlobeScene = dynamic(() => import("./globe-scene"), { ssr: false });

type Chapter = { from: number; to: number; year?: string; title: string; body: string };

const chapters: Chapter[] = [
  { from: 0.15, to: 0.37, year: "2026", title: "Off-Road Classic Cup", body: "España. Tras debutar en el CERTT en 2024 (5.º en Jaén), una temporada entera de regularidad para afinar coche y navegación." },
  { from: 0.41, to: 0.6, year: "2027", title: "CERTT y Rallye du Maroc", body: "Vuelta al Campeonato de España de Rallyes TT y la primera arena africana. Navegación de verdad." },
  { from: 0.66, to: 0.84, year: "2028", title: "Dakar", body: "Arabia Saudí. La carrera que da nombre a todo el proyecto." },
];

/** WebGL con GPU de verdad. Con renderizado por software (SwiftShader, llvmpipe) el globo iría a tirones: mejor el mapa estático. */
function hasFastWebGL() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

function ChapterPanel({ c, progress }: { c: Chapter; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [c.from - 0.05, c.from, c.to, c.to + 0.05], [0, 1, 1, 0]);
  const y = useTransform(progress, [c.from - 0.05, c.from, c.to, c.to + 0.05], [40, 0, 0, -40]);
  return (
    <motion.div style={{ opacity, y }} className="pointer-events-none absolute inset-x-0 top-24 lg:top-1/2 lg:-translate-y-1/2">
      <Container>
        <div className="max-w-[30rem]">
          <p className="t-hero tnum text-paper/95">{c.year}</p>
          <h2 className="t-title mt-3">{c.title}</h2>
          <p className="t-lead mt-4 text-paper/70">{c.body}</p>
        </div>
      </Container>
    </motion.div>
  );
}

function Timeline({ progress }: { progress: MotionValue<number> }) {
  const width = useTransform(progress, [0.08, 0.86], ["0%", "100%"]);
  return (
    <Container className="pointer-events-none absolute inset-x-0 bottom-6 lg:bottom-10">
      <div className="relative h-px bg-paper/15">
        <motion.div style={{ width }} className="absolute inset-y-0 left-0 bg-racing" />
      </div>
      <ol className="mt-3 grid grid-cols-3 t-small text-steel">
        {chapters.map((c) => (
          <li key={c.year} className="last:text-right [&:nth-child(2)]:text-center">
            {c.year}<span className="max-sm:hidden"> · {c.title}</span>
          </li>
        ))}
      </ol>
    </Container>
  );
}

/**
 * Historia guiada por scroll sobre un globo 3D. Mientras el WebGL carga (o si no está
 * disponible) se ve el mapa SVG estático; con "reducir movimiento" se muestra solo el hero.
 */
export function GlobeStory({ fallback, hero }: { fallback: ReactNode; hero: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- decisión única según preferencias del usuario
      setMode("static");
      return;
    }
    // Sin GPU: se queda la historia por scroll sobre el mapa SVG, sin cambiar la maquetación.
    if (!hasFastWebGL()) return;
    // El globo se monta cuando la página ya ha cargado y el navegador está libre: primero se ve el mapa SVG.
    let idle = 0;
    const start = () => {
      idle = window.requestIdleCallback ? window.requestIdleCallback(() => setMode("3d"), { timeout: 2500 }) : window.setTimeout(() => setMode("3d"), 600);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      window.clearTimeout(idle);
    };
  }, []);

  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.1], [0, -60]);
  const outroOpacity = useTransform(scrollYProgress, [0.88, 0.95], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  if (mode === "static") {
    return (
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-midnight lg:justify-end">
        <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#101e36_0%,rgb(16_30_54/0.85)_28%,transparent_55%)] lg:block" aria-hidden />
        <div className="relative z-10 pt-28 lg:pb-20 lg:pt-0">{hero}</div>
        <div className="relative mt-6 aspect-[4/3] w-full sm:aspect-[16/10] lg:absolute lg:inset-0 lg:-z-0 lg:mt-0 lg:aspect-auto">{fallback}</div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative h-[460vh] bg-midnight" aria-label="La ruta al Dakar">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-0" : "opacity-100")} aria-hidden>
          {fallback}
        </div>
        {mode === "3d" && (
          <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
            <GlobeScene progress={scrollYProgress} onReady={() => setReady(true)} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#101e36_0%,rgb(16_30_54/0.7)_30%,transparent_55%)] lg:block" aria-hidden />

        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="absolute inset-x-0 top-24 lg:bottom-20 lg:top-auto">
          {hero}
        </motion.div>

        {chapters.map((c) => <ChapterPanel key={c.year} c={c} progress={scrollYProgress} />)}

        <motion.div style={{ opacity: outroOpacity }} className="absolute inset-x-0 top-24 lg:top-1/2 lg:-translate-y-1/2">
          <Container>
            <div className="max-w-[30rem]">
              <h2 className="t-display">Tres temporadas. Un coche. Un objetivo.</h2>
              <div className="mt-8 flex flex-wrap items-center gap-8">
                <ButtonLink href="/objetivo-dakar" variant="light">Ver Objetivo Dakar</ButtonLink>
                <ButtonLink href="/motorsport" variant="text">Conoce el equipo</ButtonLink>
              </div>
            </div>
          </Container>
        </motion.div>

        <motion.p style={{ opacity: cueOpacity }} className="absolute bottom-24 right-5 hidden t-small text-steel sm:right-8 lg:right-12 lg:block">
          Desliza para recorrer la ruta
        </motion.p>
        <Timeline progress={scrollYProgress} />
      </div>
    </section>
  );
}
