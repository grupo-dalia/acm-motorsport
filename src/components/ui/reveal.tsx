"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Entrada suave al entrar en viewport.
 * La preferencia "reducir movimiento" se respeta globalmente vía <MotionConfig reducedMotion="user">.
 */
export function Reveal({ children, delay = 0, className, y = 28 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
