// features/enseignant/lib/documentRules.ts
export const MAX_DOCUMENT_MB = 20;
export const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",
  ".png",
  ".jpg",
  ".jpeg",
  ".txt",
];

export const ACCEPT_ATTRIBUTE = ACCEPTED_EXTENSIONS.join(",");

/** Contrôle de confort seulement : le serveur doit refaire tous ces contrôles. */
export function validateFile(file: File): string | null {
  const name = file.name.toLowerCase();
  if (!ACCEPTED_EXTENSIONS.some((extension) => name.endsWith(extension))) {
    return "Format non accepté (PDF, Word, PowerPoint, Excel, images ou texte).";
  }
  if (file.size > MAX_DOCUMENT_MB * 1024 * 1024)
    return `Fichier trop lourd (${MAX_DOCUMENT_MB} Mo maximum).`;
  if (file.size === 0) return "Le fichier est vide.";
  return null;
}

export function formatSize(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}
