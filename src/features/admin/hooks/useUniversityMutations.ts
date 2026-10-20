// hooks/useUniversityMutations.ts
import type { Statut } from "@/lib/domain";
import { universitiesApi } from "../api/universities";
import { useAdminMutation } from "./useAdminList";

type CreateBody = Parameters<typeof universitiesApi.create>[0];
type UpdateBody = Parameters<typeof universitiesApi.update>[1];

export function useUniversityMutations() {
  const create = useAdminMutation(
    (body: CreateBody) => universitiesApi.create(body),
    ["universities"],
    "Université créée",
  );
  const update = useAdminMutation(
    (v: { id: string; body: UpdateBody }) => universitiesApi.update(v.id, v.body),
    ["universities"],
    "Université mise à jour",
  );
  const setStatut = useAdminMutation(
    (v: { id: string; statut: Statut }) => universitiesApi.setStatut(v.id, v.statut),
    ["universities"],
    "Statut mis à jour",
  );
  return { create, update, setStatut };
}
