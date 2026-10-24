// features/profile/lib/avatar.ts
import { API_URL } from "@/lib/api/client";

// Seules les adresses de la forme /avatars/<clé>.webp sont affichées.
const AVATAR_PATH = /^\/avatars\/[\w-]{16,64}\.webp$/;

export const avatarSrc = (path: string | null | undefined): string | null =>
  path && AVATAR_PATH.test(path) ? `${API_URL}${path}` : null;

export const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
