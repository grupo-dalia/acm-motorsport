import "server-only";
import { z } from "zod";

/**
 * Variables de servidor. Todas opcionales: sin ellas la plataforma funciona en modo demo.
 * Nunca importar este módulo desde componentes cliente.
 */
const schema = z.object({
  COMMERCE_MODE: z.enum(["demo", "sandbox", "live"]).default("demo"),
  ALLOW_LIVE_ORDERS: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  PRINTFUL_API_KEY: z.string().optional(),
  PRINTFUL_STORE_ID: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.warn("[env] Variables inválidas, se fuerza modo demo:", parsed.error.issues);
}

export const serverEnv = parsed.success ? parsed.data : schema.parse({});

export type CommerceMode = "demo" | "sandbox" | "live";

/** Resuelve el modo efectivo: nunca 'live' sin claves y autorización explícita. */
export function effectiveCommerceMode(): CommerceMode {
  const e = serverEnv;
  const hasStripe = Boolean(e.STRIPE_SECRET_KEY && e.STRIPE_WEBHOOK_SECRET);
  if (e.COMMERCE_MODE === "live" && hasStripe && e.ALLOW_LIVE_ORDERS) return "live";
  if (e.COMMERCE_MODE !== "demo" && hasStripe) return "sandbox";
  return "demo";
}
