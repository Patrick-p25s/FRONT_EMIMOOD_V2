// features/profile/api/profile.ts
import { api } from "@/lib/api/client";
import { parseRequest, parseResponse, safeId } from "@/lib/api/validate";
import {
  accountSchema,
  avatarOutSchema,
  changePasswordSchema,
  profileSchema,
  updateAccountSchema,
  type ChangePasswordInput,
  type UpdateAccountInput,
} from "./schemas";

export const profileApi = {
  account: async () => parseResponse(accountSchema, await api<unknown>("/users/me")),

  updateAccount: async (input: UpdateAccountInput) =>
    parseResponse(
      accountSchema,
      await api<unknown>("/users/me", {
        method: "PATCH",
        body: parseRequest(updateAccountSchema, input),
      }),
    ),

  myProfile: async () => parseResponse(profileSchema, await api<unknown>("/profiles/me")),

  profile: async (userId: string) =>
    parseResponse(profileSchema, await api<unknown>(`/profiles/${safeId(userId)}`)),

  uploadAvatar: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return parseResponse(
      avatarOutSchema,
      await api<unknown>("/profiles/me/avatar", { method: "PUT", body: form }),
    );
  },

  deleteAvatar: async () => {
    await api<unknown>("/profiles/me/avatar", { method: "DELETE" });
  },

  changePassword: async (input: ChangePasswordInput) => {
    await api<unknown>("/auth/change-password", {
      method: "POST",
      body: parseRequest(changePasswordSchema, input),
    });
  },
};
