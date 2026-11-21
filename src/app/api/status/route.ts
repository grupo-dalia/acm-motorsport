import { NextResponse } from "next/server";
import { catalog, integrationStatus, printfulHealth } from "@/integrations/commerce";
import { db } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

/** Estado de integraciones (sin secretos). Útil para monitorización y para el panel. */
export async function GET() {
  const products = await catalog.listProducts();
  return NextResponse.json({ ok: true, ...integrationStatus(), shop: { products: products.length, demo: products.every((p) => p.demo) }, printful: printfulHealth, databaseHealth: await dbHealth() });
}

/** Comprueba de verdad que la base de datos responde (sin datos personales). */
async function dbHealth() {
  const supa = db();
  if (!supa) return { ok: false, error: "not_configured" };
  try {
    const { error } = await supa.from("newsletter_subscribers").select("email", { count: "exact", head: true });
    if (error) return { ok: false, error: error.message.slice(0, 160) };
    const host = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/^https?:\/\//, "").split(".")[0];
    return { ok: true, project: host };
  } catch (e) {
    const err = e as Error & { cause?: { code?: string } };
    return { ok: false, error: `${err.message}${err.cause?.code ? ` (${err.cause.code})` : ""}`.slice(0, 160) };
  }
}
