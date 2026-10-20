// hooks/useClassMutations.ts
import type { Statut } from "@/lib/domain";
import { classesApi, type CreateClasseInput, type UpdateClasseInput } from "../api/classes";
import { useAdminMutation } from "./useAdminList";

export function useClassMutations() {
  const create = useAdminMutation(
    (body: CreateClasseInput) => classesApi.create(body),
    ["classes"],
  );
  const update = useAdminMutation(
    (v: { id: string; body: UpdateClasseInput }) => classesApi.update(v.id, v.body),
    ["classes"],
    "Classe mise à jour",
  );
  const setStatut = useAdminMutation(
    (v: { id: string; statut: Statut }) => classesApi.setStatut(v.id, v.statut),
    ["classes"],
    "Statut mis à jour",
  );
  const regenerate = useAdminMutation((id: string) => classesApi.regenerate(id), ["classes"]);
  /** Lecture du code actuel : ne change rien côté serveur, donc rien à invalider. */
  const reveal = useAdminMutation((id: string) => classesApi.getCode(id), []);
  return { create, update, setStatut, regenerate, reveal };
}
