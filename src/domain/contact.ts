import { z } from "zod";

export const contactTopics = ["patrocinio", "colaboracion", "prensa", "tienda", "otro"] as const;

export const contactSchema = z.object({
  topic: z.enum(contactTopics),
  name: z.string().trim().min(2, "Tu nombre").max(120),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  email: z.email("Email no válido").max(160),
  message: z.string().trim().min(20, "Cuéntanos un poco más (mín. 20 caracteres)").max(4000),
  consent: z.literal(true, { error: "Necesitamos tu consentimiento para responderte" }),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
