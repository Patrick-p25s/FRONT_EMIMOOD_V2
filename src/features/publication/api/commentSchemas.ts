// features/publications/api/commentSchemas.ts
import { z } from "zod";

const id = z.string().uuid();

export const commentSchema = z.object({
  id,
  publication_id: id,
  parent_id: id.nullish(),
  author: z.object({ id, name: z.string(), role: z.string(), avatar_url: z.string().nullish() }),
  content: z.string(),
  created_at: z.string(),
  is_mine: z.boolean(),
});

export const commentsPageSchema = z
  .object({
    items: z.array(commentSchema),
    page: z.number().int().optional(),
    pages: z.number().int().optional(),
  })
  .transform((p) => ({ items: p.items, page: p.page ?? 1, pages: p.pages ?? null }));

export const commentInput = z.object({
  content: z.string().trim().min(1).max(2000),
  parent_id: id.optional(),
});

export type PubComment = z.output<typeof commentSchema>;
