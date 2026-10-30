import Image from "next/image";
import Link from "next/link";
import { sponsors, type Sponsor } from "@/content/motorsport";
import { cn } from "@/lib/utils";
import { SponsorLogo } from "./sponsor-logo";

const tierLabel = { principal: "Patrocinador principal", oficial: "Patrocinador oficial", colaborador: "Colaborador", referido: "Lo llevamos en el techo" } as const;

function Mark({ s, big = false }: { s: Sponsor; big?: boolean }) {
  const text = cn("font-[family-name:var(--font-display)] font-[720] leading-none tracking-[-0.03em] [font-stretch:110%]", big ? "text-[clamp(2.4rem,6vw,4.5rem)]" : "text-[1.6rem]");
  if (s.logo && /^https?:/.test(s.logo))
    return (
      <span className={cn("block", big ? "h-16 sm:h-20" : "h-12")}>
        <SponsorLogo src={s.logo} name={s.name} textClassName={text} />
      </span>
    );
  if (s.logo)
    return (
      <span className={cn("relative block w-full", big ? "h-24 max-w-[22rem]" : "h-16 max-w-[11rem]")}>
        <Image src={s.logo} alt={s.name} fill sizes={big ? "352px" : "176px"} className="object-contain object-left" />
      </span>
    );
  return <span className={cn("font-[family-name:var(--font-display)] font-[720] leading-none tracking-[-0.03em] [font-stretch:110%]", big ? "text-[clamp(2.4rem,6vw,4.5rem)]" : "text-[1.6rem]")}>{s.name}</span>;
}

/** Patrocinador principal destacado y el resto como muro de marcas. */
export function SponsorsList({ className }: { className?: string; divider?: string }) {
  const [main, ...rest] = sponsors;
  return (
    <div className={className}>
      {main && (
        <div className="grid gap-8 rounded-[8px] bg-ink p-8 text-paper sm:p-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="t-small text-paper/60">{tierLabel[main.tier]} · desde 2024</p>
            <div className="mt-6"><Mark s={main} big /></div>
          </div>
          <div className="lg:col-span-5">
            {main.story && <p className="t-lead text-paper/80">{main.story}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-6">
              {main.url && <a href={main.url} target="_blank" rel="noopener sponsored" className="link-u">{main.url.replace(/^https?:\/\/(www\.)?/, "")}</a>}
              {main.code && <span>Código <strong className="tracking-wide">{main.code}</strong></span>}
            </div>
          </div>
        </div>
      )}
      <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {rest.map((s) => {
          const body = (
            <>
              <span className="flex min-h-16 items-center"><Mark s={s} /></span>
              <span className="mt-6 block t-small opacity-60">{tierLabel[s.tier]}</span>
              <span className="mt-1 block t-small">{s.description}{s.code ? <> · código <strong className="tracking-wide">{s.code}</strong></> : null}</span>
            </>
          );
          const tone = s.tile === "dark" ? "bg-ink text-paper" : s.tile === "white" ? "bg-white text-ink ring-1 ring-line-dark" : "bg-mist text-ink";
          const cls = cn("flex h-full flex-col justify-between rounded-[8px] p-6 transition-colors", tone);
          return (
            <li key={s.id}>
              {s.url ? (
                s.url.startsWith("/") ? <Link href={s.url} className={cn(cls, "hover:opacity-90")}>{body}</Link> : <a href={s.url} target="_blank" rel="noopener sponsored" className={cn(cls, "hover:opacity-90")}>{body}</a>
              ) : (
                <div className={cls}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
