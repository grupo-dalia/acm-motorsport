import { cn } from "@/lib/utils";

/** Franja rojigualda: acento de identidad (rojo-amarillo-rojo). Usar con moderación. */
export function Stripe({ className, vertical = false }: { className?: string; vertical?: boolean }) {
  return (
    <span aria-hidden className={cn("inline-flex shrink-0", vertical ? "h-10 w-1.5 flex-col" : "h-1.5 w-10", className)}>
      <span className="flex-1 bg-racing" />
      <span className="flex-[2] bg-gold" />
      <span className="flex-1 bg-racing" />
    </span>
  );
}
