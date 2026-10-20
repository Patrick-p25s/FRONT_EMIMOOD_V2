// pages/university-detail/invitationSchema.ts
import { z } from "zod";

export const invitationSchema = z.object({
  role: z.enum(["teacher", "moderator"]),
  max_uses: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[1-9]\d{0,5}$/.test(v), "Nombre entier positif attendu"),
  expires_at: z
    .string()
    .refine(
      (v) => v === "" || new Date(`${v}T23:59:59`).getTime() > Date.now(),
      "La date doit être dans le futur",
    ),
});

export type InvitationFormValues = z.infer<typeof invitationSchema>;
