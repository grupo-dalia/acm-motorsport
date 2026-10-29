import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logotipo tipográfico provisional. Sustituir por el vectorial oficial cuando exista. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-baseline gap-2.5", className)} aria-label="ACM Motorsport, inicio">
      <span className="font-[family-name:var(--font-display)] text-[1.45rem] font-[680] leading-none tracking-[-0.03em] [font-stretch:125%]">ACM</span>
      <span className="text-[0.95rem] font-medium leading-none opacity-70">Motorsport</span>
    </Link>
  );
}
