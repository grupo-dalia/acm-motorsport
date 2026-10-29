import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";
import type { ReactNode } from "react";

export function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  className,
  align = "left",
  as: Tag = "h2",
  action,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
  action?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", align === "center" && "items-center text-center md:flex-col md:items-center", className)}>
      <Reveal className="max-w-3xl">
        <p className="eyebrow flex items-center gap-3">
          {index && <span className="text-racing">{index}</span>}
          {index && <span className="h-px w-8 bg-line-strong" aria-hidden />}
          {eyebrow}
        </p>
        <Tag className="display mt-5 text-[length:var(--text-display-md)]">{title}</Tag>
        {lead && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/70">{lead}</p>}
      </Reveal>
      {action && <Reveal delay={0.1}>{action}</Reveal>}
    </div>
  );
}
