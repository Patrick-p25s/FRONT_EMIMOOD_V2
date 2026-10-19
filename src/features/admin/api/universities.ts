import { Statut } from "@/lib/domain";
import { University } from "./types";
import { api, patch, post } from "./http";

export const universitiesApi = {
  get: (id: string) => api<University>(`/universities/${id}`),
  create: (b: { name: string; code: string; description?: string; logo_url?: string }) =>
    post<University>("/universities/create", b),
  update: (
    id: string,
    b: { name?: string; description?: string | null; logo_url?: string | null },
  ) => patch<University>(`/universities/${id}`, b),
  setStatut: (id: string, statut: Statut) =>
    patch<University>(`/universities/${id}/statut`, { statut }),
};
