import Link from "next/link";
import { cn } from "@/lib/utils";

/** Marca tipográfica provisional ACM. Sustituir por el logotipo vectorial oficial cuando exista. */
export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex items-center gap-3", className)} aria-label="ACM Motorsport — inicio">
      <span className="relative flex items-center">
        <span className="display display-italic text-[1.65rem] leading-none tracking-[-0.04em]">ACM</span>
        <span aria-hidden className="ml-1.5 flex h-[1.1rem] w-1 -skew-x-12 flex-col">
          <span className="flex-1 bg-racing" />
          <span className="flex-[2] bg-gold" />
          <span className="flex-1 bg-racing" />
        </span>
      </span>
      {!compact && (
        <span className="hidden font-mono text-[0.6rem] uppercase leading-tight tracking-[0.28em] text-paper/60 sm:block">
          Motor
          <br />
          sport
        </span>
      )}
    </Link>
  );
}
