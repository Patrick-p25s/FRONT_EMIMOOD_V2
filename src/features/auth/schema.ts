import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Saisissez une adresse email valide"),
  password: z.string().min(1, "Le mot de passe est requis"),
});

export const registerSchema = z.object({
  first_name: z.string().trim().min(2, "Au moins 2 caractères").max(100, "100 caractères maximum"),
  last_name: z.string().trim().min(2, "Au moins 2 caractères").max(100, "100 caractères maximum"),
  phone_number: z
    .string()
    .trim()
    .min(8, "Saisissez un numéro valide")
    .max(30, "30 caractères maximum")
    .regex(/^[+()\d\s.-]+$/, "Saisissez un numéro valide"),
  email: z.string().trim().email("Saisissez une adresse email valide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(128, "128 caractères maximum"),
  invitation_code: z.string().trim().min(1, "Le code d’invitation est requis").max(100),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
