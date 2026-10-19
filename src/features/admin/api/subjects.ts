// api/subjects.ts : catalogue des matières
import { del, patch, post } from "./http";
import type { Subject } from "./types";

export type CreateSubjectInput = {
  university_id: string;
  name: string;
  code?: string;
  description?: string;
};
export type UpdateSubjectInput = { name?: string; description?: string | null };

export const subjectsApi = {
  create: (input: CreateSubjectInput) => post<Subject>("/subjects/create", input),
  update: (id: string, input: UpdateSubjectInput) => patch<Subject>(`/subjects/${id}`, input),
  remove: (id: string) => del(`/subjects/${id}`),
};
