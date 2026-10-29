import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Contours } from "@/components/media/contours";
import { cn } from "@/lib/utils";

/** Cabecera editorial para páginas interiores. */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
  tone = "midnight",
  size = "md",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: { label: string; href: string }[];
  children?: ReactNode;
  tone?: "midnight" | "ink";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-line", tone === "midnight" ? "bg-midnight" : "bg-ink")}>
      <Contours className="absolute inset-0 -z-10 h-full w-full text-[#7f9cd1]/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/80 to-transparent" />
      <Container className={cn("pt-28 lg:pt-36", size === "sm" ? "pb-12" : size === "lg" ? "pb-24 lg:pb-32" : "pb-16 lg:pb-24")}>
        <Breadcrumbs items={crumbs} />
        <p className="eyebrow mt-10">{eyebrow}</p>
        <h1 className={cn("display mt-5 max-w-5xl", size === "sm" ? "text-[length:var(--text-display-md)]" : "text-[length:var(--text-display-lg)]")}>{title}</h1>
        {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/75">{lead}</p>}
        {children}
      </Container>
    </section>
  );
}
