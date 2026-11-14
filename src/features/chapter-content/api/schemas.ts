import { z } from "zod";

export const MAX_BLOCK = 20_000;
const id = z.string().uuid();

export const chapterContentSchema = z.object({ id, content: z.string() });
export const chapterContentsSchema = z.array(chapterContentSchema);

export const blockTextSchema = z
  .string()
  .trim()
  .min(1, "Le contenu ne peut pas être vide.")
  .max(MAX_BLOCK, "20 000 caractères au maximum.");
export const createBlocksSchema = z.array(blockTextSchema).min(1).max(20);
export const updateBlockSchema = z.object({ content: blockTextSchema });

export type ChapterContent = z.output<typeof chapterContentSchema>;
