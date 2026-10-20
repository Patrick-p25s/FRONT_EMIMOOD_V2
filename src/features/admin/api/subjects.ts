// api/subjects.ts : catalogue des matières
import { readItems } from "../lib/payload";
import { api, del, patch, post } from "./http";
import type { Subject } from "./types";

export type CreateSubjectInput = {
  university_id: string;
  name: string;
  code?: string;
  description?: string;
};
export type UpdateSubjectInput = { name?: string; description?: string | null };

export const subjectsApi = {
  list: async (university_id: string) =>
    readItems<Subject>(
      await api<unknown>("/subjects/", { query: { university_id, page: "1", page_size: "100" } }),
    ),
  create: (input: CreateSubjectInput) => post<Subject>("/subjects/create", input),
  update: (id: string, input: UpdateSubjectInput) => patch<Subject>(`/subjects/${id}`, input),
  remove: (id: string) => del(`/subjects/${id}`),
};
