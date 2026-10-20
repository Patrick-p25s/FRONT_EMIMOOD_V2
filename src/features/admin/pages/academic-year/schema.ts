import { z } from "zod";

export const accademicYearSchema = z
  .object({
    name: z.string().trim().min(4, "4 caractères minimum").max(15, "15 caractères maximum"),

    start_date: z.string().trim(),

    end_date: z.string().trim(),

    is_current: z.boolean().default(false),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "La date de fin doit être postérieure à la date de début",
    path: ["end_date"],
  });

export type AccademicYearValues = z.infer<typeof accademicYearSchema>;
