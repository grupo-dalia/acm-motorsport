import { NextResponse } from "next/server";
import { catalog, integrationStatus, printfulHealth } from "@/integrations/commerce";

export const dynamic = "force-dynamic";

/** Estado de integraciones (sin secretos). Útil para monitorización y para el panel. */
export async function GET() {
  const products = await catalog.listProducts();
  return NextResponse.json({ ok: true, ...integrationStatus(), shop: { products: products.length, demo: products.every((p) => p.demo) }, printful: printfulHealth });
}
