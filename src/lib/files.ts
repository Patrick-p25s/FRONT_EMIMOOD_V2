// lib/files.ts
export const MAX_FILE_MB = 20; // à aligner sur la limite du serveur
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / 1024 / 1024).toFixed(1)} Mo`;
}
