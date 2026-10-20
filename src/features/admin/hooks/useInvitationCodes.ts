// hooks/useInvitationCodes.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { invitationCodesApi } from "../api/invitationCodes";
import type { InvitationCode } from "../api/types";
import { adminKeys } from "../keys";
import { readItems } from "../lib/payload";
import { useAdminMutation } from "./useAdminList";

export function useInvitationCodes(universityId: string, activeOnly: boolean) {
  return useQuery({
    queryKey: adminKeys.list("invitation-codes", {
      university_id: universityId,
      active_only: activeOnly,
    }),
    queryFn: async () =>
      readItems<InvitationCode>(
        await api<unknown>("/invitation-codes/", {
          query: {
            university_id: universityId,
            active_only: String(activeOnly),
            skip: "0",
            limit: "200",
          },
        }),
      ),
  });
}

export function useInvitationMutations() {
  const create = useAdminMutation(invitationCodesApi.create, ["invitation-codes"]);
  const deactivate = useAdminMutation(
    (id: string) => invitationCodesApi.deactivate(id),
    ["invitation-codes"],
    "Code désactivé",
  );
  return { create, deactivate };
}
