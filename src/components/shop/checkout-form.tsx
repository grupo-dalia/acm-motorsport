"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { customerSchema } from "@/domain/checkout";
import { useCart } from "./cart-provider";
import { OrderSummary } from "./order-summary";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const formSchema = customerSchema.extend({ acceptTerms: z.boolean().refine((v) => v, "Debes aceptar las condiciones") });
type FormValues = z.input<typeof formSchema>;

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="t-small font-medium">{label}</span>
      <span className="mt-2 block">{children}</span>
      {error && <span role="alert" className="mt-1.5 block text-xs text-racing">{error}</span>}
    </label>
  );
}
const inputCls = "h-12 w-full rounded-[var(--radius-btn)] bg-mist px-4 text-ink placeholder:text-slate focus:outline-none focus:ring-2 focus:ring-ink/25 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-racing/60";

export function CheckoutForm() {
  const { cart, totals, hydrated } = useCart();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  // Una clave por intento de compra: reintentos/dobles clics no duplican pedidos.
  const [idemKey] = useState(() => crypto.randomUUID());

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { country: "ES", acceptTerms: false },
  });

  if (!hydrated) return <div className="h-96 animate-pulse rounded-[6px] bg-mist" aria-busy="true" />;
  if (totals.lines.length === 0)
    return (
      <div className="py-16">
        <p className="t-title">Tu cesta está vacía.</p>
        <Link href="/tienda" className={buttonVariants({ variant: "dark", className: "mt-8" })}>Ir a la tienda</Link>
      </div>
    );

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const { acceptTerms, ...customer } = values;
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart, customer, acceptTerms, idempotencyKey: idemKey }),
    });
    const data = (await res.json().catch(() => ({ ok: false, message: "Error de red" }))) as { ok: boolean; message?: string; redirectUrl?: string };
    if (!data.ok || !data.redirectUrl) {
      setServerError(data.message ?? "No se ha podido completar.");
      return;
    }
    router.push(data.redirectUrl);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-10 lg:grid-cols-12">
      <div className="space-y-10 lg:col-span-7">
        <fieldset className="space-y-5">
          <legend className="t-sub mb-2">Contacto</legend>
          <Field label="Email" error={errors.email?.message}>
            <input type="email" autoComplete="email" className={inputCls} aria-invalid={!!errors.email} {...register("email")} />
          </Field>
          <Field label="Teléfono (opcional, para el transportista)" error={errors.phone?.message}>
            <input type="tel" autoComplete="tel" className={inputCls} {...register("phone")} />
          </Field>
        </fieldset>
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="t-sub mb-2">Dirección de envío</legend>
          <Field label="Nombre y apellidos" error={errors.name?.message} className="sm:col-span-2">
            <input autoComplete="name" className={inputCls} aria-invalid={!!errors.name} {...register("name")} />
          </Field>
          <Field label="Dirección" error={errors.address1?.message} className="sm:col-span-2">
            <input autoComplete="address-line1" className={inputCls} aria-invalid={!!errors.address1} {...register("address1")} />
          </Field>
          <Field label="Piso, puerta… (opcional)" className="sm:col-span-2">
            <input autoComplete="address-line2" className={inputCls} {...register("address2")} />
          </Field>
          <Field label="Código postal" error={errors.postalCode?.message}>
            <input inputMode="numeric" autoComplete="postal-code" className={inputCls} aria-invalid={!!errors.postalCode} {...register("postalCode")} />
          </Field>
          <Field label="Localidad" error={errors.city?.message}>
            <input autoComplete="address-level2" className={inputCls} aria-invalid={!!errors.city} {...register("city")} />
          </Field>
          <Field label="Provincia" error={errors.province?.message}>
            <input autoComplete="address-level1" className={inputCls} aria-invalid={!!errors.province} {...register("province")} />
          </Field>
          <Field label="País">
            <select className={inputCls} {...register("country")}><option value="ES">España (península y Baleares)</option></select>
          </Field>
        </fieldset>
        <label className="flex items-start gap-3 text-slate">
          <input type="checkbox" className="mt-0.5 size-4 accent-racing" {...register("acceptTerms")} />
          <span>He leído y acepto las <Link href="/legal/condiciones" className="underline underline-offset-2">condiciones de contratación</Link> y la <Link href="/legal/privacidad" className="underline underline-offset-2">política de privacidad</Link>.</span>
        </label>
        {errors.acceptTerms && <p role="alert" className="-mt-6 text-xs text-racing">{errors.acceptTerms.message}</p>}
      </div>

      <div className="lg:col-span-5">
        <div className="space-y-4 lg:sticky lg:top-28">
          <OrderSummary editableCoupon={false} />
          <p className="t-small text-slate">Tienda en pruebas: al confirmar se crea un pedido de ejemplo. No se conecta con ninguna pasarela ni se cobra nada.</p>
          {serverError && <p role="alert" className="text-racing">{serverError}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creando el pedido…" : "Confirmar pedido de prueba"}
          </Button>
        </div>
      </div>
    </form>
  );
}
