import { NextResponse } from "next/server";
import { integrationStatus } from "@/integrations/commerce";

/** Estado de integraciones (sin secretos). Útil para monitorización y para el futuro dashboard. */
export async function GET() {
  return NextResponse.json({ ok: true, ...integrationStatus() });
}
