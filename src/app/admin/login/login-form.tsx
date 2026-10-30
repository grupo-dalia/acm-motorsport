"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-10 space-y-5">
      <label className="block">
        <span className="t-small text-slate">Email</span>
        <input name="email" type="email" required autoComplete="username" className="mt-2 h-12 w-full rounded-[6px] border border-line-dark bg-paper px-4 outline-none focus:border-ink" />
      </label>
      <label className="block">
        <span className="t-small text-slate">Contraseña</span>
        <input name="password" type="password" required autoComplete="current-password" className="mt-2 h-12 w-full rounded-[6px] border border-line-dark bg-paper px-4 outline-none focus:border-ink" />
      </label>
      {state?.error && <p className="text-racing" role="alert">{state.error}</p>}
      <Button type="submit" variant="dark" disabled={pending} className="w-full">{pending ? "Entrando…" : "Entrar"}</Button>
    </form>
  );
}
