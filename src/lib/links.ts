export type SafeLink = { href: string; host: string };

/** Seules les adresses http(s) sont ouvertes. */
export function toSafeLink(raw: string): SafeLink | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return { href: url.href, host: url.hostname.replace(/^www\./, "") };
  } catch {
    return null;
  }
}

export const isHttpUrl = (value: string): boolean => toSafeLink(value) !== null;
