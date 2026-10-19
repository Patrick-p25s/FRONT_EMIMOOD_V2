// api/classes.ts : mention et level sont des textes, université et année directement sur la classe
import { Statut } from "@/lib/auth";
import { api, patch, post } from "./http";
import type { Classe, ClasseWithCode } from "./types";

export type CreateClasseInput = {
  university_id: string;
  academic_year_id: string;
  mention: string;
  level: string;
  name: string;
  code: string;
  description?: string;
};
export type UpdateClasseInput = { name?: string; description?: string | null };

export const classesApi = {
  create: (input: CreateClasseInput) => post<ClasseWithCode>("/classes/create", input),
  update: (id: string, input: UpdateClasseInput) => patch<Classe>(`/classes/${id}`, input),
  setStatut: (id: string, statut: Statut) => patch<Classe>(`/classes/${id}/statut`, { statut }),
  getCode: (id: string) => api<{ code_invitation: string }>(`/classes/${id}/invitation-code`),
  regenerate: (id: string) => post<ClasseWithCode>(`/classes/${id}/regenerate-invitation-code`),
};
