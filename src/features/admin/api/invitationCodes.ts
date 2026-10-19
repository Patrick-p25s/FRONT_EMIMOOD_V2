// api/invitationCodes.ts
import { patch, post } from "./http";
import type { InvitationCode } from "./types";

export type CreateInvitationCodeInput = {
  university_id: string;
  role: "teacher" | "moderator";
  max_uses?: number;
  expires_at?: string;
};

export const invitationCodesApi = {
  create: (input: CreateInvitationCodeInput) =>
    post<InvitationCode>("/invitation-codes/create", input),
  deactivate: (id: string) => patch<InvitationCode>(`/invitation-codes/${id}/deactivate`),
};
