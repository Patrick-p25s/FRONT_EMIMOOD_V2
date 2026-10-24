// features/profile/keys.ts
export const profileKeys = {
  all: ["profile"] as const,
  account: ["profile", "account"] as const,
  me: ["profile", "me"] as const,
  of: (userId: string) => ["profile", "of", userId] as const,
};
