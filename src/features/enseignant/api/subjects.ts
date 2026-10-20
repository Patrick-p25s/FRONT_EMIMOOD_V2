// features/enseignant/api/subjects.ts
import type { ClassChoice, MySubject } from "./types";
import { api, del, patch, post } from "./http";

export type CreateSubjectInput = {
  name: string;
  code?: string;
  description?: string;
  classe_ids: string[];
  semester?: number;
};
export type UpdateSubjectInput = { name?: string; description?: string | null };
export type AddClassesInput = { classe_ids: string[]; semester?: number };

export const subjectsApi = {
  mine: () => api<MySubject[]>("/subjects/mine"),
  availableClasses: () => api<ClassChoice[]>("/subjects/available-classes"),
  create: (input: CreateSubjectInput) => post<unknown>("/subjects/mine/create", input),
  update: (id: string, input: UpdateSubjectInput) => patch<unknown>(`/subjects/${id}`, input),
  addClasses: (id: string, input: AddClassesInput) =>
    post<unknown>(`/subjects/${id}/classes`, input),
  removeClass: (id: string, classeId: string) => del(`/subjects/${id}/classes/${classeId}`),
  remove: (id: string) => del(`/subjects/${id}`),
};
