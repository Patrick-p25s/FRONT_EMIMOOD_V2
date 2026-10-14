import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

export type AdminSearch = {
  u?: string | undefined;
  q?: string | undefined;
  page?: number | undefined;
  page_size?: number | undefined;
  statut?: string | undefined;
  role?: string | undefined;
  classe?: string | undefined;
  mention?: string | undefined;
  level?: string | undefined;
  year?: string | undefined;
  univ?: string | undefined;
  active?: string | undefined;
  tab?: string | undefined;
};

/** Filtres, page et recherche dans l'URL (liens partageables). */
export function useAdminSearch() {
  const search = useSearch({ strict: false }) as AdminSearch;
  const navigate = useNavigate();
  const set = useCallback(
    (patch: Partial<AdminSearch>, resetPage = true) => {
      const next: AdminSearch = { ...search, ...(resetPage ? { page: undefined } : {}), ...patch };
      (Object.keys(next) as (keyof AdminSearch)[]).forEach((k) => {
        if (next[k] === "" || next[k] === undefined) delete next[k];
      });
      void navigate({ to: ".", search: next as never, replace: true });
    },
    [search, navigate],
  );
  return [search, set] as const;
}

/** Recherche avec délai de 300 ms. */
export function useDebouncedQ(q: string | undefined, onChange: (v: string) => void) {
  const [value, setValue] = useState(q ?? "");
  useEffect(() => setValue(q ?? ""), [q]);
  useEffect(() => {
    if (value === (q ?? "")) return;
    const t = setTimeout(() => onChange(value), 300);
    return () => clearTimeout(t);
  }, [value, q, onChange]);
  return [value, setValue] as const;
}
