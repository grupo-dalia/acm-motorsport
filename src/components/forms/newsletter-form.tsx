"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type State = { status: "idle" | "loading" | "ok" | "error"; message?: string };

export function NewsletterForm({ className }: { className?: string }) {
  const [state, setState] = useState<State>({ status: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ status: "loading" });
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), consent: form.get("consent") === "on", website: form.get("website") }),
      });
      const data = (await res.json()) as { ok: boolean; message: string };
      setState({ status: data.ok ? "ok" : "error", message: data.message });
    } catch {
      setState({ status: "error", message: "No se ha podido enviar. Inténtalo de nuevo." });
    }
  }

  if (state.status === "ok")
    return (
      <p role="status" className={cn("flex items-center gap-3 text-paper", className)}>
        <Check className="size-5 text-racing" /> {state.message}
      </p>
    );

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} noValidate={false}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="nl-email" className="sr-only">Correo electrónico</label>
        <input
          id="nl-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="tu@correo.com"
          className="h-14 flex-1 border border-line-strong bg-ink/40 px-5 text-paper placeholder:text-paper/35 focus:border-paper focus:outline-none"
        />
        {/* honeypot anti-spam */}
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button type="submit" disabled={state.status === "loading"} className="inline-flex h-14 items-center justify-center gap-3 bg-paper px-7 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-ink transition hover:bg-white disabled:opacity-50">
          {state.status === "loading" ? "Enviando…" : "Suscribirme"} <ArrowRight className="size-4" />
        </button>
      </div>
      <label className="mt-3 flex items-start gap-2.5 text-xs leading-relaxed text-paper/60">
        <input type="checkbox" name="consent" required className="mt-0.5 size-4 shrink-0 accent-racing" />
        <span>
          Acepto recibir novedades de ACM Motorsport y la <Link href="/legal/privacidad" className="underline underline-offset-2">política de privacidad</Link>. Puedes darte de baja cuando quieras.
        </span>
      </label>
      {state.status === "error" && <p role="alert" className="mt-2 text-sm text-racing">{state.message}</p>}
    </form>
  );
}
