import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { db } from "./service";

/** Cliente con la sesión del usuario (cookies). Para login del panel. */
export async function authClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const store = await cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // En componentes de servidor no se pueden escribir cookies; lo hace la acción de login.
        }
      },
    },
  });
}

/** Usuario administrador actual, o null. Comprueba la tabla admin_users con la clave de servidor. */
export async function currentAdmin() {
  const supa = await authClient();
  const service = db();
  if (!supa || !service) return null;
  const { data } = await supa.auth.getUser();
  if (!data.user) return null;
  const { data: row } = await service.from("admin_users").select("role").eq("user_id", data.user.id).maybeSingle();
  return row ? { id: data.user.id, email: data.user.email ?? "", role: row.role as string } : null;
}
