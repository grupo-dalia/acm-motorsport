"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authClient, currentAdmin } from "@/lib/supabase/auth";
import { db } from "@/lib/supabase/service";

export async function login(_: { error?: string } | undefined, form: FormData) {
  const supa = await authClient();
  if (!supa) return { error: "Supabase no está configurado." };
  const email = String(form.get("email") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const { error } = await supa.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email o contraseña incorrectos." };
  if (!(await currentAdmin())) {
    await supa.auth.signOut();
    return { error: "Esta cuenta no tiene acceso al panel." };
  }
  redirect("/admin");
}

export async function logout() {
  const supa = await authClient();
  await supa?.auth.signOut();
  redirect("/admin/login");
}

export async function toggleLeadHandled(form: FormData) {
  if (!(await currentAdmin())) throw new Error("No autorizado");
  const id = String(form.get("id"));
  const handled = form.get("handled") === "1";
  await db()?.from("leads").update({ handled_at: handled ? null : new Date().toISOString() }).eq("id", id);
  revalidatePath("/admin");
}
