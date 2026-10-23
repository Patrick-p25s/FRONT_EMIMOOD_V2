// src/lib/api/download.ts
import { apiBlob } from "./client";

/** Télécharge un fichier protégé : un simple lien ne porterait pas le jeton. */
export async function downloadFile(path: string, fileName: string): Promise<void> {
  const blob = await apiBlob(path);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
