// features/chapter-content/api/chapterContent.ts
import { api } from "@/lib/api/client";
import { parseRequest, parseResponse, safeId } from "@/lib/api/validate";
import {
  chapterContentSchema,
  chapterContentsSchema,
  createBlocksSchema,
  updateBlockSchema,
} from "./schemas";

export const chapterContentApi = {
  list: async (chapterId: string) =>
    parseResponse(
      chapterContentsSchema,
      await api<unknown>(`/chapters/${safeId(chapterId)}/content`),
    ),
  // chapter_id est un paramètre de requête, le corps est la liste des textes
  create: async (chapterId: string, texts: string[]) =>
    parseResponse(
      chapterContentsSchema,
      await api<unknown>("/content", {
        method: "POST",
        query: { chapter_id: safeId(chapterId) },
        body: parseRequest(createBlocksSchema, texts),
      }),
    ),
  update: async (id: string, content: string) =>
    parseResponse(
      chapterContentSchema,
      await api<unknown>(`/content/${safeId(id)}`, {
        method: "PATCH",
        body: parseRequest(updateBlockSchema, { content }),
      }),
    ),
};
