export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

/** Accepte une réponse paginée OU un simple tableau. */
export function normalizeList<T>(
  data: Paginated<T> | T[] | undefined,
  page = 1,
  pageSize = 20,
): Paginated<T> {
  if (!data) return { items: [], total: 0, page, page_size: pageSize, pages: 0 };
  if (Array.isArray(data)) {
    return {
      items: data,
      total: data.length,
      page: 1,
      page_size: data.length || pageSize,
      pages: data.length ? 1 : 0,
    };
  }
  return data;
}

/** Chemin interne sûr pour `next` (aucune redirection ouverte). */
export function safeNext(next: unknown): string | null {
  return typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\")
    ? next
    : null;
}
