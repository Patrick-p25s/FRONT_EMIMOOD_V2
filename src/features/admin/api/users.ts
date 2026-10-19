// api/users.ts
import { Statut } from "@/lib/domain";
import { api, patch } from "./http";
import type { AdminUser } from "./types";

export const usersApi = {
  get: (id: string) => api<AdminUser>(`/users/${id}`),
  setStatut: (id: string, statut: Statut) => patch<AdminUser>(`/users/${id}/statut`, { statut }),
  setClasse: (id: string, classe_id: string) =>
    patch<AdminUser>(`/users/${id}/classe`, { classe_id }),
};
