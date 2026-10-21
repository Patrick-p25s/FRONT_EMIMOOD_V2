// features/enseignant/api/http.ts : petits raccourcis au-dessus du client commun
import { api } from "@/lib/api/client";
import { string } from "zod/v4";

export { api };

export const post = <T>(path: string, body?: unknown) =>
  api<T>(path, { method: "POST", ...(body === undefined ? {} : { body }) });

export const del = (path: string) => api<unknown>(path, { method: "DELETE" });

export const patch = <T>(path: string, body: unknown) => api<T>(path, { method: "PATCH", body });

export const postForm = <T>(path: string, body: FormData) => api<T>(path, { method: "POST", body });
