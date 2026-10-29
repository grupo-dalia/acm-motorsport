import { z } from "zod";
import { cartSchema } from "./cart";

const CP_ES = /^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/;

export const customerSchema = z.object({
  email: z.email("Introduce un email válido").max(160),
  name: z.string().trim().min(3, "Nombre y apellidos").max(120),
  address1: z.string().trim().min(5, "Dirección completa").max(160),
  address2: z.string().trim().max(160).optional().or(z.literal("")),
  city: z.string().trim().min(2, "Localidad").max(80),
  postalCode: z.string().trim().regex(CP_ES, "Código postal español de 5 cifras"),
  province: z.string().trim().min(2, "Provincia").max(80),
  country: z.literal("ES"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
});

export const checkoutRequestSchema = z.object({
  cart: cartSchema,
  customer: customerSchema,
  acceptTerms: z.literal(true, { error: "Debes aceptar las condiciones" }),
  idempotencyKey: z.string().uuid(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
