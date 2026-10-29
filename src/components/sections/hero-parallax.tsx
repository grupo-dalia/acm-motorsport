"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Parallax moderado: el fondo se desplaza más lento y el contenido se desvanece al hacer scroll. */
export function HeroParallax({ background, children, className }: { background: ReactNode; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  return (
    <section ref={ref} className={className}>
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 will-change-transform">
        {background}
      </motion.div>
      <motion.div style={{ y: fgY, opacity: fade }} className="relative h-full">
        {children}
      </motion.div>
    </section>
  );
}
