// lib/payload.ts : lit un tableau ou { items } (même idée que l'admin)
export function readItems<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (typeof data === "object" && data !== null) {
    const items = (data as Record<string, unknown>)["items"];
    if (Array.isArray(items)) return items as T[];
  }
  return [];
}
