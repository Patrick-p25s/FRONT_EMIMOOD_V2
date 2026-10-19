// src/features/admin/lib/payload.ts
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Nombre total d'une réponse de liste ({ total } ou tableau). */
export function readTotal(data: unknown): number {
  if (Array.isArray(data)) return data.length;
  if (isRecord(data)) {
    const total = data["total"];
    if (typeof total === "number") return total;
  }
  return 0;
}

/** Éléments d'une réponse de liste ({ items } ou tableau). */
export function readItems<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (isRecord(data)) {
    const items = data["items"];
    if (Array.isArray(items)) return items as T[];
  }
  return [];
}
