// lib/schema.ts
import { z } from "zod";

export const publicationSchema = z
  .object({
    publication_type: z.enum(["resource", "experience", "project", "announcement", "event"]),
    visibility: z.enum(["class", "university"]),
    classe_id: z.string(),
    subject_id: z.string(),
    title: z.string().trim().max(200, "200 caractères maximum"),
    content: z.string().trim().min(1, "Obligatoire").max(5000, "5000 caractères maximum"),
    link_url: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || /^https?:\/\//i.test(value),
        "Le lien doit commencer par http:// ou https://",
      ),
    event_at: z.string(),
    event_location: z.string().trim().max(200, "200 caractères maximum"),
  })
  .superRefine((values, ctx) => {
    if (values.visibility === "class" && values.classe_id === "") {
      ctx.addIssue({ code: "custom", path: ["classe_id"], message: "Choisissez une classe" });
    }
    if (values.publication_type === "event" && values.event_at === "") {
      ctx.addIssue({
        code: "custom",
        path: ["event_at"],
        message: "La date de l’événement est obligatoire",
      });
    }
  });

export type PublicationFormValues = z.infer<typeof publicationSchema>;
