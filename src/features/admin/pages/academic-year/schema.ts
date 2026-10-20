import { z } from "zod";

export const accademicYearSchema = z
  .object({
    name: z.string().trim().min(4, "4 caractères minimum").max(15, "15 caractères maximum"),

    start_date: z
      .string()
      .refine(
        (v) => v === "" || new Date(`${v}T23:59:59`).getTime() > Date.now(),
        "La date doit être dans le futur",
      ),

    end_date: z
      .string()
      .refine(
        (v) => v === "" || new Date(`${v}T23:59:59`).getTime() > Date.now(),
        "La date doit être dans le futur",
      ),

    is_current: z.boolean({
      required_error: "Le statut actuel est obligatoire",
      invalid_type_error: "Le statut actuel doit être un booléen",
    }),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["end_date"], // Attribue l'erreur directement au champ 'end_at'
  });

export type AccademicYearValues = z.infer<typeof accademicYearSchema>;
