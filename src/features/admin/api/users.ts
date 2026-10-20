// api/users.ts
import { Statut } from "@/lib/domain";
import { api, patch } from "./http";
import type { AdminUser } from "./types";
import { readItems } from "../lib/payload";

export const usersApi = {
  list: async (params: { university_id: string; role: string; q?: string }) =>
    readItems<AdminUser>(
      await api<unknown>("/users/", {
        query: {
          university_id: params.university_id,
          role: params.role,
          ...(params.q ? { q: params.q } : {}),
          skip: "0",
          limit: "100",
        },
      }),
    ),
  get: (id: string) => api<AdminUser>(`/users/${id}`),
  setStatut: (id: string, statut: Statut) => patch<AdminUser>(`/users/${id}/statut`, { statut }),
  setClasse: (id: string, classe_id: string) =>
    patch<AdminUser>(`/users/${id}/classe`, { classe_id }),
};
