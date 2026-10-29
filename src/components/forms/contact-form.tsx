"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
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

const inputCls = "w-full border border-line-strong bg-surface px-4 text-paper placeholder:text-paper/30 focus:border-paper focus:outline-none aria-[invalid=true]:border-racing";

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
      <div role="status" className="flex items-start gap-4 border border-line bg-surface p-8">
        <Check className="mt-1 size-6 shrink-0 text-racing" />
        <div>
          <p className="text-lg font-semibold">Mensaje enviado</p>
          <p className="mt-1 text-paper/70">{done}</p>
        </div>
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-5 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className="eyebrow">Motivo</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((t) => (
            <label key={t.value} className="cursor-pointer">
              <input type="radio" value={t.value} className="peer sr-only" {...register("topic")} />
              <span className="inline-flex h-10 items-center border border-line-strong px-4 text-sm transition peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-racing">{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="eyebrow">Nombre</span>
        <input autoComplete="name" className={`${inputCls} mt-2 h-12`} aria-invalid={!!errors.name} {...register("name")} />
        {errors.name && <span role="alert" className="mt-1 block text-xs text-racing">{errors.name.message}</span>}
      </label>
      <label className="block">
        <span className="eyebrow">Empresa (opcional)</span>
        <input autoComplete="organization" className={`${inputCls} mt-2 h-12`} {...register("company")} />
      </label>
      <label className="block sm:col-span-2">
        <span className="eyebrow">Email</span>
        <input type="email" autoComplete="email" className={`${inputCls} mt-2 h-12`} aria-invalid={!!errors.email} {...register("email")} />
        {errors.email && <span role="alert" className="mt-1 block text-xs text-racing">{errors.email.message}</span>}
      </label>
      <label className="block sm:col-span-2">
        <span className="eyebrow">Mensaje</span>
        <textarea rows={6} className={`${inputCls} mt-2 py-3`} aria-invalid={!!errors.message} placeholder="Cuéntanos tu marca, qué te interesa y en qué plazos." {...register("message")} />
        {errors.message && <span role="alert" className="mt-1 block text-xs text-racing">{errors.message.message}</span>}
      </label>
      <input tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("website")} />
      <label className="flex items-start gap-3 text-sm text-paper/70 sm:col-span-2">
        <input type="checkbox" className="mt-0.5 size-4 accent-racing" {...register("consent")} />
        <span>Acepto la <Link href="/legal/privacidad" className="underline underline-offset-2">política de privacidad</Link> para que podáis responderme.</span>
      </label>
      {errors.consent && <p role="alert" className="-mt-3 text-xs text-racing sm:col-span-2">{errors.consent.message}</p>}
      {serverError && <p role="alert" className="text-sm text-racing sm:col-span-2">{serverError}</p>}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting}>{isSubmitting ? "Enviando…" : "Enviar mensaje"}</Button>
      </div>
    </form>
  );
}
