import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

const tones = {
  neutral: "border-line-strong text-paper/80",
  red: "border-racing/60 text-racing bg-racing/10",
  blue: "border-midnight-2 text-[#9db5e0] bg-midnight/60",
  amber: "border-gold/40 text-gold bg-gold/10",
  solid: "border-paper bg-paper text-ink",
} as const;

export function Badge({ className, tone = "neutral", ...props }: ComponentProps<"span"> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em]", tones[tone], className)}
      {...props}
    />
  );
}
