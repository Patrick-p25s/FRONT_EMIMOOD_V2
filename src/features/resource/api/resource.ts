import { api } from "@/lib/api/client";
import { parseRequest, parseResponse, safeId } from "@/lib/api/validate";
import {
  resourceSchema,
  resourcesPageSchema,
  updateSchema,
  UploadInput,
  uploadSchema,
} from "./schemas";
import { z } from "zod";

export const PAGE_SIZE = 20;

export type ResourceFilters = {
  q: string;
  origin?: "official" | "community" | undefined;
  saved?: boolean | undefined;
  media?: string | undefined;
  subjectId?: string | undefined;
};

export const resourcesApi = {
  list: async (filters: ResourceFilters, page: number) =>
    parseResponse(
      resourcesPageSchema,
      await api<unknown>("/resources", {
        query: {
          page,
          page_size: PAGE_SIZE,
          ...(filters.q ? { q: filters.q } : {}),
          ...(filters.origin ? { origin: filters.origin } : {}),
          ...(filters.saved ? { saved: "true" } : {}),
          ...(filters.media ? { media: filters.media } : {}),
          ...(filters.subjectId ? { subject_id: safeId(filters.subjectId) } : {}),
        },
      }),
    ),
  save: async (id: string) => {
    await api<unknown>(`/resources/${safeId(id)}/save`, { method: "PUT" });
  },
  unsave: async (id: string) => {
    await api<unknown>(`/resources/${safeId(id)}/save`, { method: "DELETE" });
  },
  update: async (id: string, input: { title: string; description: string }) => {
    await api<unknown>(`/documents/${safeId(id)}`, {
      method: "PATCH",
      body: parseRequest(updateSchema, input),
    });
  },
  remove: async (id: string) => {
    await api<unknown>(`/documents/${safeId(id)}`, { method: "DELETE" });
  },
  chapter: async (chapterId: string) =>
    parseResponse(
      z.array(resourceSchema),
      await api<unknown>(`/chapters/${safeId(chapterId)}/documents`),
    ),
  upload: async (input: UploadInput) => {
    const p = parseRequest(uploadSchema, input);
    const form = new FormData();
    form.append("source", p.source);
    if (p.title) form.append("title", p.title);
    if (p.description) form.append("description", p.description);
    if (p.chapterId) form.append("chapter_id", safeId(p.chapterId));
    if (p.subjectId) form.append("subject_id", safeId(p.subjectId));
    if (p.universityId) form.append("university_id", safeId(p.universityId));
    if (p.url) form.append("url", p.url);
    if (p.file) form.append("file", p.file, p.file.name);
    await api<unknown>("/documents", { method: "POST", body: form });
  },
};
