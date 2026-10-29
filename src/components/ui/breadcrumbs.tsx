import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd, breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  const all = [{ label: "Inicio", href: "/" }, ...items];
  return (
    <nav aria-label="Ruta de navegación" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-steel">
      <JsonLd data={breadcrumbLd(all)} />
      <ol className="flex flex-wrap items-center gap-1.5">
        {all.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3" aria-hidden />}
            {i === all.length - 1 ? (
              <span aria-current="page" className="text-paper/80">{item.label}</span>
            ) : (
              <Link href={item.href} className="transition-colors hover:text-paper">{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
