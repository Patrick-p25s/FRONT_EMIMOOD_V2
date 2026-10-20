// pages/universities/schema.ts
import { z } from "zod";

export const universitySchema = z.object({
  name: z.string().trim().min(2, "Au moins 2 caractères").max(150, "150 caractères maximum"),
  code: z.string().trim().min(2, "Au moins 2 caractères").max(30, "30 caractères maximum"),
  description: z.string().trim().max(1000, "1000 caractères maximum"),
  // Facultatif ; https uniquement, car le logo n'est affiché qu'en https.
  logo_url: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^https:\/\/\S+$/.test(value),
      "Lien https:// valide attendu",
    ),
});

export type UniversityFormValues = z.infer<typeof universitySchema>;
