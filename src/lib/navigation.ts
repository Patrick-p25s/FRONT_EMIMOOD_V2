/** Accepte seulement un chemin interne : "/messages", jamais "https://…" ni "//site". */
export function safeNext(value: string | undefined): string | undefined {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\"))
    return undefined;
  return value;
}
