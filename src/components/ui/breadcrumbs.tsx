import Link from "next/link";
import { JsonLd, breadcrumbLd } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  const all = [{ label: "Inicio", href: "/" }, ...items];
  return (
    <nav aria-label="Ruta de navegación" className="t-small opacity-70">
      <JsonLd data={breadcrumbLd(all)} />
      <ol className="flex flex-wrap items-center gap-x-2">
        {all.map((item, i) => (
          <li key={item.href + i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {i === all.length - 1 ? <span aria-current="page">{item.label}</span> : <Link href={item.href} className="hover:underline">{item.label}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
