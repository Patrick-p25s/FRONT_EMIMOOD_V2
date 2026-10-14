import { useEffect } from "react";
import { useAdminSearch } from "@/features/admin/hooks/useAdminSearch";
import { useUniversities } from "@/features/admin/hooks/resources";

const KEY = "admin.u";

/** Université active : ?u=<id> dans l'URL, mémorisée en sessionStorage, validée. */
export function useActiveUniversity() {
  const [search, set] = useAdminSearch();
  const all = useUniversities();
  const u = search.u;

  useEffect(() => {
    if (!u) {
      const saved = sessionStorage.getItem(KEY);
      if (saved) set({ u: saved }, false);
    } else sessionStorage.setItem(KEY, u);
  }, [u, set]);

  useEffect(() => {
    if (u && all.data && !all.data.items.some((x) => x.id === u)) {
      sessionStorage.removeItem(KEY);
      set({ u: undefined }, false);
    }
  }, [u, all.data, set]);

  const university = all.data?.items.find((x) => x.id === u);
  const setUniversity = (id: string | undefined) => {
    if (!id) sessionStorage.removeItem(KEY);
    set({ u: id, mention: undefined, level: undefined, classe: undefined, year: undefined });
  };
  return { universityId: u, university, setUniversity, universities: all.data?.items ?? [] };
}
