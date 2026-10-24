// features/profile/lib/schemas.ts : validation des formulaires
import { z } from "zod";

export const profileFormSchema = z.object({
  first_name: z.string().trim().min(1, "Obligatoire").max(120, "120 caractères maximum"),
  last_name: z.string().trim().min(1, "Obligatoire").max(120, "120 caractères maximum"),
  phone_number: z.string().trim().max(30, "30 caractères maximum"),
  bio: z.string().max(5000, "5000 caractères maximum"),
});
export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const passwordFormSchema = z
  .object({
    current_password: z.string().min(1, "Obligatoire"),
    new_password: z.string().min(8, "Au moins 8 caractères").max(128, "128 caractères maximum"),
    confirm: z.string(),
  })
  .superRefine((values, ctx) => {
    if (values.new_password !== values.confirm) {
      ctx.addIssue({
        code: "custom",
        path: ["confirm"],
        message: "Les mots de passe ne correspondent pas",
      });
    }
    if (values.new_password !== "" && values.new_password === values.current_password) {
      ctx.addIssue({
        code: "custom",
        path: ["new_password"],
        message: "Le nouveau mot de passe doit être différent de l’ancien",
      });
    }
  });
export type PasswordFormValues = z.infer<typeof passwordFormSchema>;
