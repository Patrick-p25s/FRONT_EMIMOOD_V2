// features/publications/api/comments.ts
import { api } from "@/lib/api/client";
import { parseRequest, parseResponse, safeId } from "@/lib/api/validate";
import { commentInput, commentSchema, commentsPageSchema } from "./commentSchemas";

export const COMMENTS_PAGE_SIZE = 20;
const path = (publicationId: string) => `/publications/${safeId(publicationId)}/comments`;

export const commentsApi = {
  list: async (publicationId: string, page: number) =>
    parseResponse(
      commentsPageSchema,
      await api<unknown>(path(publicationId), { query: { page, page_size: COMMENTS_PAGE_SIZE } }),
    ),
  add: async (publicationId: string, content: string, parentId?: string | undefined) =>
    parseResponse(
      commentSchema,
      await api<unknown>(path(publicationId), {
        method: "POST",
        body: parseRequest(commentInput, { content, ...(parentId ? { parent_id: parentId } : {}) }),
      }),
    ),
};
