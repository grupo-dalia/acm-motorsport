"use client";

import Link from "next/link";
import { useState } from "react";
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

  if (state.status === "ok") return <p role="status" className={className}>{state.message}</p>;

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <div className="flex gap-2 border-b border-current/30 focus-within:border-current">
        <label htmlFor="nl-email" className="sr-only">Correo electrónico</label>
        <input id="nl-email" name="email" type="email" required autoComplete="email" placeholder="Tu correo" className="h-14 min-w-0 flex-1 bg-transparent text-lg placeholder:text-current/40 focus:outline-none" />
        <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <button type="submit" disabled={state.status === "loading"} className="shrink-0 font-medium disabled:opacity-50">
          {state.status === "loading" ? "Enviando…" : "Suscribirme"}
        </button>
      </div>
      <label className="mt-4 flex items-start gap-2.5 t-small opacity-70">
        <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-racing" />
        <span>Acepto la <Link href="/legal/privacidad" className="link-u">política de privacidad</Link>. Puedes darte de baja cuando quieras.</span>
      </label>
      {state.status === "error" && <p role="alert" className="mt-2 t-small text-racing">{state.message}</p>}
    </form>
  );
}
