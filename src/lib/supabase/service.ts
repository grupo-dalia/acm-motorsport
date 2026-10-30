import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de servidor con la clave secreta: salta RLS. Solo para rutas de API y páginas
 * del panel tras comprobar que el usuario es administrador. Nunca llega al navegador.
 * Devuelve null si Supabase no está configurado (la web sigue funcionando en modo demo).
 */
let client: SupabaseClient | null | undefined;

export function db(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}
