import { NewsletterForm } from "@/components/forms/newsletter-form";
import { cn } from "@/lib/utils";

/** Bloque compacto para captar suscriptores al Club ACM (10 % de bienvenida). */
export function ClubSignup({ className }: { className?: string }) {
  return (
    <aside aria-label="Club ACM" className={cn("grid gap-6 rounded-[18px] bg-ink p-6 text-paper md:grid-cols-[1fr_1.1fr] md:items-center md:p-10", className)}>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-racing-bright">Club ACM</p>
        <p className="mt-2 text-2xl font-semibold leading-tight md:text-3xl">10 % en tu primer pedido.</p>
        <p className="mt-2 t-small opacity-70">Apúntate y te mandamos el código. Además: ofertas solo para el club y las camisetas nuevas antes que nadie.</p>
      </div>
      <NewsletterForm cta="Quiero mi 10 %" />
    </aside>
  );
}
