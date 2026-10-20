// pages/subjects/subjectSchema.ts
import { z } from "zod";

export const subjectSchema = z.object({
  name: z.string().trim().min(2, "Au moins 2 caractères").max(150, "150 caractères maximum"),
  code: z.string().trim().max(50, "50 caractères maximum"),
  description: z.string().trim().max(1000, "1000 caractères maximum"),
  semester: z.string(),
  classe_ids: z.array(z.string()),
});

export type SubjectFormValues = z.infer<typeof subjectSchema>;
