"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/domain/contact";
import { Button } from "@/components/ui/button";
import type { z } from "zod";

const topics: { value: ContactInput["topic"]; label: string }[] = [
  { value: "patrocinio", label: "Patrocinio" },
  { value: "colaboracion", label: "Colaboración de contenido" },
  { value: "prensa", label: "Prensa" },
  { value: "tienda", label: "Tienda / pedido" },
  { value: "otro", label: "Otro" },
];

const inputCls = "w-full rounded-[var(--radius-btn)] bg-mist px-4 text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-ink/25 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-racing/60";

export function ContactForm({ defaultTopic = "patrocinio" }: { defaultTopic?: ContactInput["topic"] }) {
  const [done, setDone] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.input<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: { topic: defaultTopic },
  });

  async function onSubmit(values: z.input<typeof contactSchema>) {
    setServerError(null);
    const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const data = (await res.json().catch(() => ({ ok: false, message: "Error de red" }))) as { ok: boolean; message: string };
    if (data.ok) setDone(data.message);
    else setServerError(data.message);
  }

  if (done)
    return (
      <div role="status" className="rounded-[6px] bg-mist p-8">
        <p className="t-sub">Mensaje enviado</p>
        <p className="mt-2 text-slate">{done}</p>
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className="t-small font-medium">Motivo</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((t) => (
            <label key={t.value} className="cursor-pointer">
              <input type="radio" value={t.value} className="peer sr-only" {...register("topic")} />
              <span className="inline-flex h-10 items-center rounded-full bg-mist px-4 transition-colors peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-racing">{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="t-small font-medium">Nombre</span>
        <input autoComplete="name" className={`${inputCls} mt-2 h-12`} aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <span role="alert" className="mt-1 block text-xs text-racing">{errors.name.message}</span>}
      </label>
      <label className="block">
        <span className="t-small font-medium">Empresa (opcional)</span>
        <input autoComplete="organization" className={`${inputCls} mt-2 h-12`} {...register("company")} />
      </label>
      <label className="block sm:col-span-2">
        <span className="t-small font-medium">Email</span>
        <input type="email" autoComplete="email" className={`${inputCls} mt-2 h-12`} aria-invalid={!!errors.email} {...register("email")} />
        {errors.email && <span role="alert" className="mt-1 block text-xs text-racing">{errors.email.message}</span>}
      </label>
      <label className="block sm:col-span-2">
        <span className="t-small font-medium">Mensaje</span>
        <textarea rows={6} className={`${inputCls} mt-2 py-3`} aria-invalid={!!errors.message} placeholder="Cuéntanos tu marca, qué te interesa y en qué plazos." {...register("message")} />
        {errors.message && <span role="alert" className="mt-1 block text-xs text-racing">{errors.message.message}</span>}
      </label>
      <input tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("website")} />
      <label className="flex items-start gap-3 text-slate sm:col-span-2">
        <input type="checkbox" className="mt-0.5 size-4 accent-racing" {...register("consent")} />
        <span>Acepto la <Link href="/legal/privacidad" className="underline underline-offset-2">política de privacidad</Link> para que podáis responderme.</span>
      </label>
      {errors.consent && <p role="alert" className="-mt-3 text-xs text-racing sm:col-span-2">{errors.consent.message}</p>}
      {serverError && <p role="alert" className="text-sm text-racing sm:col-span-2">{serverError}</p>}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" variant="dark" disabled={isSubmitting}>{isSubmitting ? "Enviando…" : "Enviar mensaje"}</Button>
      </div>
    </form>
  );
}
