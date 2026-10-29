import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { cn } from "@/lib/utils";
import { WordReveal } from "@/components/ui/word-reveal";

/** Cabecera de páginas interiores: titular grande, entradilla y, opcionalmente, una imagen a sangre. */
export function PageHero({ title, lead, crumbs, children, tone = "midnight", media }: { title: ReactNode; lead?: ReactNode; crumbs: { label: string; href: string }[]; children?: ReactNode; tone?: "midnight" | "paper"; media?: ReactNode }) {
  return (
    <section className={cn(tone === "paper" ? "on-paper" : "bg-midnight")}>
      <Container className="pb-14 pt-28 lg:pb-20 lg:pt-40">
        <Breadcrumbs items={crumbs} />
        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 className="t-hero max-w-[14ch] lg:col-span-8">{typeof title === "string" ? <WordReveal text={title} /> : title}</h1>
          {lead && <p className="t-lead opacity-75 lg:col-span-4">{lead}</p>}
        </div>
        {children}
      </Container>
      {media}
    </section>
  );
}
