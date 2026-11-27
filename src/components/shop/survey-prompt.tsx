"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useCart } from "./cart-provider";
import { Button } from "@/components/ui/button";

/**
 * Encuesta de una pregunta en las fichas: "¿Qué te frena?". Sale una sola vez por visita
 * (sessionStorage, uso técnico) cuando alguien lleva un rato mirando sin añadir nada a la cesta.
 * No usa cookies ni datos personales: solo la respuesta y la ficha. Llega por email al equipo.
 */
const KEY = "acm.survey.v1";
const DELAY_MS = 35_000;

export const SURVEY_OPTIONS = [
  "El precio",
  "No sé qué talla me va",
  "El envío o lo que tarda",
  "No conozco la tienda, no me fío",
  "Prefiero otro diseño o color",
  "Solo estaba mirando",
] as const;

export function SurveyPrompt({ productName }: { productName: string }) {
  const { count } = useCart();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [other, setOther] = useState("");
  const hasItems = count > 0;

  useEffect(() => {
    if (hasItems) return;
    try {
      if (window.sessionStorage.getItem(KEY)) return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => {
      // no taparle el banner de cookies a quien aún no ha decidido
      if (document.querySelector("[data-cookie-banner]")) return;
      setOpen(true);
      try {
        window.sessionStorage.setItem(KEY, "shown");
      } catch {}
    }, DELAY_MS);
    return () => window.clearTimeout(t);
  }, [hasItems, pathname]);

  async function answer(reason: string) {
    setSent(true);
    try {
      await fetch("/api/encuesta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reason, other: other.trim() || undefined, page: pathname, product: productName }),
        keepalive: true,
      });
    } catch {}
    window.setTimeout(() => setOpen(false), 2600);
  }

  if (!open || hasItems) return null;

  return (
    <div role="dialog" aria-labelledby="survey-title" className="fixed inset-x-3 bottom-3 z-[65] mx-auto max-w-sm rounded-[10px] bg-paper p-5 text-ink shadow-[0_20px_60px_rgb(0_0_0/0.35)] ring-1 ring-black/5 sm:bottom-6 sm:left-auto sm:right-6">
      <button type="button" onClick={() => setOpen(false)} className="absolute right-3 top-3 grid size-8 place-items-center rounded-full text-slate hover:bg-mist hover:text-ink" aria-label="Cerrar">
        <X className="size-4" />
      </button>
      {sent ? (
        <p className="pr-6 font-medium">¡Gracias! Nos ayuda un montón a mejorar la tienda. 🙌</p>
      ) : (
        <>
          <p id="survey-title" className="pr-8 font-semibold">¿Qué te frena para llevártela?</p>
          <p className="mt-1 t-small text-slate">Un toque y nos ayudas a mejorar. Es anónimo.</p>
          <div className="mt-4 grid gap-2">
            {SURVEY_OPTIONS.map((o) => (
              <button key={o} type="button" onClick={() => answer(o)} className="rounded-[var(--radius-btn)] bg-mist px-4 py-2.5 text-left text-sm transition-colors hover:bg-ink hover:text-paper">
                {o}
              </button>
            ))}
          </div>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (other.trim()) answer("Otra cosa");
            }}
          >
            <input value={other} onChange={(e) => setOther(e.target.value.slice(0, 280))} placeholder="Otra cosa…" aria-label="Otra cosa" className="min-w-0 flex-1 rounded-[var(--radius-btn)] border border-line-dark bg-paper px-3 text-sm" />
            <Button size="sm" type="submit" disabled={!other.trim()}>Enviar</Button>
          </form>
        </>
      )}
    </div>
  );
}
