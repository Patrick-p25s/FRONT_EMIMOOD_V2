// pages/university-detail/classSchema.ts
import { z } from "zod";

export const classSchema = z.object({
  academic_year_id: z.string().min(1, "Choisissez une année"),
  mention: z.string().trim().min(1, "Obligatoire").max(100, "100 caractères maximum"),
  level: z.string().trim().min(1, "Obligatoire").max(50, "50 caractères maximum"),
  name: z.string().trim().min(2, "Au moins 2 caractères").max(150, "150 caractères maximum"),
  code: z.string().trim().min(1, "Obligatoire").max(50, "50 caractères maximum"),
  description: z.string().trim().max(1000, "1000 caractères maximum"),
});

export type ClassFormValues = z.infer<typeof classSchema>;
