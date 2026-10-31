import { z } from "zod";
import { isHttpUrl } from "@/lib/links";

const id = z.string().uuid();

export const RESOURCE_TYPES = ["document", "video", "link", "other"] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const courseResourceSchema = z.object({
  id,
  chapter_id: id,
  created_by: id,
  title: z.string(),
  description: z.string().nullable(),
  resource_type: z.enum(RESOURCE_TYPES),
  url: z.string(), // contrôlée à l'affichage (http/https seulement)
  position: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const courseResourcesSchema = z
  .union([z.array(courseResourceSchema), z.object({ items: z.array(courseResourceSchema) })])
  .transform((value) => (Array.isArray(value) ? value : value.items));

// Ce que l'on envoie (le serveur reste l'autorité).
const title = z
  .string()
  .trim()
  .min(1, "Le titre est obligatoire.")
  .max(200, "200 caractères au maximum.");
const url = z
  .string()
  .trim()
  .min(1)
  .max(2083)
  .refine(isHttpUrl, "L’adresse doit commencer par http:// ou https://.");
const description = z.string().trim().max(5000, "5000 caractères au maximum.");

export const createCourseResourceSchema = z.object({
  chapter_id: id,
  title,
  resource_type: z.enum(RESOURCE_TYPES),
  url,
  description: description.optional(),
});
export const updateCourseResourceSchema = z.object({
  title: title.optional(),
  description: description.nullable().optional(),
  resource_type: z.enum(RESOURCE_TYPES).optional(),
  url: url.optional(),
});

export type CourseResource = z.output<typeof courseResourceSchema>;
export type CreateCourseResourceInput = z.input<typeof createCourseResourceSchema>;
export type UpdateCourseResourceInput = z.input<typeof updateCourseResourceSchema>;
