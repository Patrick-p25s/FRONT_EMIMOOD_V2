import { useAdminMutation } from "./useAdminList";
import { Statut } from "@/lib/domain";
import { usersApi } from "../api";

export function useUserMutations() {
  const setStatut = useAdminMutation(
    (v: { id: string; statut: Statut }) => usersApi.setStatut(v.id, v.statut),
    ["users"],
    "Status mise à jour",
  );
  const setClasse = useAdminMutation(
    (v: { id: string; classe_id: string }) => usersApi.setClasse(v.id, v.classe_id),
    ["users"],
    "Classe modifiée",
  );
  return { setStatut, setClasse };
}
