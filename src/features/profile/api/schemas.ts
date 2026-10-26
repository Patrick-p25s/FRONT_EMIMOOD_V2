// features/profile/api/schemas.ts
import { z } from "zod";

const id = z.string().uuid();

export const accountSchema = z.object({
  id,
  university_id: id.nullable(),
  classe_id: id.nullable(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone_number: z.string().nullable(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),
  role: z.string(),
  statut: z.string(),
  is_verified: z.boolean(),
  is_delegate: z.boolean().optional(),
});

export const profileSchema = z.object({
  id,
  name: z.string(),
  role: z.string(),
  avatar_url: z.string().nullable(),
  bio: z.string().nullable(),
  member_since: z.string(),
  is_me: z.boolean(),
  publications_count: z.number().int(),
  subjects: z.array(z.string()),
});

export const avatarOutSchema = z.object({ avatar_url: z.string().nullable() });

// Ce que l'on envoie : les limites du serveur.
export const updateAccountSchema = z.object({
  first_name: z.string().trim().min(1).max(120).optional(),
  last_name: z.string().trim().min(1).max(120).optional(),
  phone_number: z.string().trim().max(30).optional(),
  bio: z.string().max(5000).optional(),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1).max(128),
  new_password: z.string().min(8).max(128),
});

export type Account = z.infer<typeof accountSchema>;
export type Profile = z.infer<typeof profileSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
