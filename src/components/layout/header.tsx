"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./logo";
import { mainNav, site } from "@/content/site";
import { useCart } from "@/components/shop/cart-provider";
import { cn } from "@/lib/utils";
import { Stripe } from "@/components/ui/stripe";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, hydrated, setOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar menú al navegar
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        solid ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-10">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative px-4 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.12em] transition-colors",
                      active ? "text-paper" : "text-paper/65 hover:text-paper",
                    )}
                  >
                    {item.label}
                    <span className={cn("absolute inset-x-4 -bottom-0.5 h-0.5 origin-left bg-racing transition-transform duration-500", active ? "scale-x-100" : "scale-x-0")} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative grid size-11 place-items-center text-paper/85 transition hover:text-paper"
            aria-label={`Abrir carrito${hydrated && count ? `, ${count} artículos` : ""}`}
          >
            <ShoppingBag className="size-5" />
            {hydrated && count > 0 && (
              <span className="absolute right-1 top-1 grid min-w-4 place-items-center rounded-full bg-racing px-1 font-mono text-[0.6rem] font-bold leading-4">{count}</span>
            )}
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink lg:hidden"
          >
            <nav aria-label="Menú móvil" className="flex min-h-full flex-col justify-between px-4 pb-10 pt-8 sm:px-6">
              <ul className="space-y-1">
                {mainNav.map((item, i) => (
                  <motion.li key={item.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                    <Link href={item.href} className="group flex items-baseline justify-between border-b border-line py-4">
                      <span className="display text-4xl group-hover:text-racing">{item.label}</span>
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-steel">0{i + 1}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-10 flex items-center justify-between">
                <Stripe />
                <span className="font-mono text-xs text-steel">{site.handle}</span>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
