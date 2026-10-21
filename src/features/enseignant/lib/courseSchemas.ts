// lib/courseSchemas.ts
import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().trim().min(2, "Au moins 2 caractères").max(200, "200 caractères maximum"),
  description: z.string().trim().max(5000, "5000 caractères maximum"),
});
export const chapterSchema = courseSchema;

export const resourceSchema = z.object({
  title: z.string().trim().min(1, "Obligatoire").max(200, "200 caractères maximum"),
  resource_type: z.enum(["document", "video", "link", "other"]),
  // http ou https seulement : le serveur refuse le reste (javascript: etc.).
  url: z
    .string()
    .trim()
    .regex(/^https?:\/\/\S+$/i, "Lien http:// ou https:// valide attendu"),
  description: z.string().trim().max(5000, "5000 caractères maximum"),
});

export type CourseFormValues = z.infer<typeof courseSchema>;
export type ResourceFormValues = z.infer<typeof resourceSchema>;
