import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/** Título editorial a la izquierda y entradilla en columna propia. Sin etiquetas decorativas. */
export function SectionHeading({ title, lead, action, className, id, as: Tag = "h2" }: { title: ReactNode; lead?: ReactNode; action?: ReactNode; className?: string; id?: string; as?: "h1" | "h2" }) {
  return (
    <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-end", className)}>
      <Tag id={id} className="t-display max-w-[16ch] lg:col-span-7">{title}</Tag>
      {(lead || action) && (
        <div className="lg:col-span-4 lg:col-start-9">
          {lead && <p className="t-lead opacity-75">{lead}</p>}
          {action && <div className={cn(lead && "mt-6")}>{action}</div>}
        </div>
      )}
    </div>
  );
}
