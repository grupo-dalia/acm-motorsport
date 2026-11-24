import { z } from "zod";
import { cartSchema } from "./cart";
import { activeZoneFor, isValidPostalCode } from "./shipping";

export const customerBaseSchema = z.object({
  email: z.email("Introduce un email válido").max(160),
  name: z.string().trim().min(3, "Nombre y apellidos").max(120),
  address1: z.string().trim().min(5, "Dirección completa").max(160),
  address2: z.string().trim().max(160).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Localidad").max(80),
  postalCode: z.string().trim().min(2, "Código postal").max(12),
  province: z.string().trim().min(2, "Provincia").max(80),
  country: z.string().trim().length(2).toUpperCase(),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
});

/** Código postal válido y dirección dentro de una zona activa. Se reutiliza en el formulario del checkout. */
export function refineCustomer(c: { country: string; postalCode: string }, ctx: z.RefinementCtx) {
  if (!isValidPostalCode(c.country, c.postalCode)) {
    ctx.addIssue({ code: "custom", path: ["postalCode"], message: c.country === "ES" ? "Código postal español de 5 cifras" : "Código postal no válido" });
    return;
  }
  // Solo se vende a las zonas activas (src/content/shipping.ts). Hoy: España peninsular y Baleares.
  if (!activeZoneFor(c.country, c.postalCode)) {
    ctx.addIssue({ code: "custom", path: ["postalCode"], message: c.country === "ES" ? "De momento no enviamos a Canarias, Ceuta ni Melilla." : "De momento no enviamos a este país." });
  }
}

export const customerSchema = customerBaseSchema.superRefine(refineCustomer);

export const checkoutRequestSchema = z.object({
  cart: cartSchema,
  customer: customerSchema,
  acceptTerms: z.literal(true, { error: "Debes aceptar las condiciones" }),
  idempotencyKey: z.string().uuid(),
  /** Cookies de marketing aceptadas en el navegador: solo entonces se envía la compra a Meta desde el servidor. */
  marketingConsent: z.boolean().optional().default(false),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
