"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./logo";
import { mainNav, site } from "@/content/site";
import { useCart } from "@/components/shop/cart-provider";
import { cn } from "@/lib/utils";

/** Páginas cuya cabecera arranca sobre fondo claro */
const LIGHT_TOP = ["/tienda", "/carrito", "/checkout", "/legal", "/contacto", "/noticias", "/admin"];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, hydrated, setOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const lightTop = LIGHT_TOP.some((p) => pathname.startsWith(p));
  const solid = scrolled || menuOpen;
  const light = lightTop && !menuOpen;

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-300",
        light ? "text-ink" : "text-paper",
        solid && (light ? "bg-paper/92 shadow-[0_1px_0_rgb(8_10_15/0.08)] backdrop-blur-md" : "bg-midnight/92 shadow-[0_1px_0_rgb(245_247_250/0.08)] backdrop-blur-md"),
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[76px] lg:px-12">
        <Logo />
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {mainNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link href={item.href} aria-current={active ? "page" : undefined} className={cn("text-[0.95rem] font-medium transition-opacity", active ? "opacity-100" : "opacity-70 hover:opacity-100")}>
                    {item.label}
                    <span className={cn("mt-1 block h-px bg-current transition-transform duration-300", active ? "scale-x-100" : "scale-x-0")} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setOpen(true)} className="flex h-10 items-center gap-2 px-2 text-[0.95rem] font-medium">
            Cesta
            <span className={cn("grid size-6 place-items-center rounded-full text-[0.75rem] tnum", hydrated && count > 0 ? "bg-racing text-paper" : "bg-current/12")}>{hydrated ? count : 0}</span>
            <span className="sr-only">artículos</span>
          </button>
          <button
            type="button"
            className="flex h-10 items-center px-2 text-[0.95rem] font-medium lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? "Cerrar" : "Menú"}
          </button>
        </div>
      </div>

    </header>
      <AnimatePresence>
        {menuOpen && (
          <motion.div id="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed inset-x-0 bottom-0 top-16 z-[49] overflow-y-auto bg-midnight text-paper lg:hidden">
            <nav aria-label="Menú móvil" className="flex min-h-full flex-col justify-between px-5 pb-10 pt-6 sm:px-8">
              <ul>
                {mainNav.map((item, i) => (
                  <motion.li key={item.href} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                    <Link href={item.href} className="block border-b border-line py-4">
                      <span className="t-title block">{item.label}</span>
                      {item.description && <span className="t-small text-steel">{item.description}</span>}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-10 t-small text-steel">{site.handle}</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
