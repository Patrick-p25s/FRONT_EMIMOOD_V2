import { z } from "zod";
import { personSchema } from "@/features/messaging/api/schemas";

const id = z.string().uuid();

const section = <T extends z.ZodType>(item: T) =>
  z
    .object({ items: z.array(item), total: z.number().int().optional() })
    .transform((s) => ({ items: s.items, total: s.total ?? s.items.length }));

const courseHit = z
  .object({
    course_id: id,
    class_subject_id: id,
    title: z.string(),
    subject_name: z.string().nullish(),
    subject_code: z.string().nullish(),
  })
  .transform((c) => ({
    id: c.course_id,
    classSubjectId: c.class_subject_id,
    title: c.title,
    subtitle: [c.subject_name, c.subject_code].filter(Boolean).join(" · "),
  }));

const resourceHit = z
  .object({
    publication_id: id,
    document_id: id.nullish(),
    title: z.string(),
    kind: z.string().nullish(),
    file_name: z.string().nullish(),
    file_type: z.string().nullish(),
    author_name: z.string().nullish(),
    subject_name: z.string().nullish(),
    created_at: z.string().nullish(),
  })
  .transform((r) => ({
    id: r.publication_id,
    documentId: r.document_id ?? null,
    title: r.title,
    kind: r.kind ?? "",
    fileName: r.file_name ?? r.title,
    subtitle: [r.author_name, r.subject_name].filter(Boolean).join(" · "),
  }));

export const searchSchema = z.object({
  courses: section(courseHit).optional(),
  resources: section(resourceHit).optional(),
  people: section(personSchema).optional(),
});

export const searchTerm = z.string().trim().min(2).max(100);
export type SearchResults = z.output<typeof searchSchema>;
