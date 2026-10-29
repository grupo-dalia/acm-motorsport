import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const tones = {
  neutral: "bg-current/8 text-current",
  live: "bg-racing/12 text-racing",
  note: "bg-[#f1bf00]/14 text-[#8a6d00] dark:text-[#f1bf00]",
  solid: "bg-ink text-paper",
} as const;

/** Etiqueta discreta en minúscula: informa (tipo de venta, estado), no decora. */
export function Badge({ className, tone = "neutral", ...props }: ComponentProps<"span"> & { tone?: keyof typeof tones }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.78rem] font-medium", tones[tone], className)} {...props} />;
}
