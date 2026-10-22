// lib/errorMessage.ts
export function errorMessage(error: unknown): string {
  const detail = (error as { detail?: unknown } | null)?.detail;
  if (typeof detail === "string") return detail;
  return error instanceof Error ? error.message : "Une erreur est survenue";
}
