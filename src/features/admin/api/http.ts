// api/http.ts
import { api } from "@/lib/api/client";

export { api };
export const post = <T>(path: string, body?: unknown) => api<T>(path, { method: "POST", body });
export const patch = <T>(path: string, body?: unknown) => api<T>(path, { method: "PATCH", body });
export const del = (path: string) => api<void>(path, { method: "DELETE" });
