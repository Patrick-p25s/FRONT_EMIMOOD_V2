import { Statut } from "@/lib/auth";
import { useAdminMutation } from "./useAdminList";
import { usersApi } from "../api";

export function useUserMutation() {
  const setStatut = useAdminMutation(
    (v: { id: string; statut: Statut }) => usersApi.setStatut(v.id, v.statut),
    ["users"],
    "Statut mis à jour",
  );
  const setClass = useAdminMutation(
    (v: { id: string; class_id: string }) => usersApi.setClasse(v.id, v.class_id),
    ["users"],
    "Classe mise à jour",
  );
  return { setStatut, setClass };
}
