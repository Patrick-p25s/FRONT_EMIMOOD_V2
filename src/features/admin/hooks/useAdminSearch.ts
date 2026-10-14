import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

export type AdminSearch = {
  u?: string;
  q?: string;
  page?: number;
  page_size?: number;
  statut?: string;
  role?: string;
  classe?: string;
  mention?: string;
  level?: string;
  year?: string;
  univ?: string;
  active?: string;
  tab?: string;
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
