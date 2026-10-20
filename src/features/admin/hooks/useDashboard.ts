// src/features/admin/hooks/useDashboard.ts
import { useQueries, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { AcademicYear } from "../api/types";
import { adminKeys, type Resource } from "../keys";
import { readItems, readTotal } from "../lib/payload";

export type CountSpec = {
  key: string;
  resource: Resource;
  /** Chemin exact de l'API, avec le slash final. */
  path: string;
  params?: Record<string, string>;
  /** Vrai : le chiffre suit l'université active (?u=). */
  scoped?: boolean;
  paging?: "page" | "skip";
};

// 2. remplacez fetchTotal par
async function fetchTotal(
  path: string,
  params: Record<string, string>,
  paging: "page" | "skip" = "page",
) {
  const window = paging === "skip" ? { skip: "0", limit: "1000" } : { page: "1", page_size: "1" };
  const data = await api<unknown>(path, { query: { ...params, ...window } });
  return readTotal(data);
}

// 3. dans useCounts : queryFn: () => fetchTotal(spec.path, params, spec.paging ?? "page"),
//    dans useUniversityUserCounts : fetchTotal("/users/", { university_id: id }, "skip")

/** Plusieurs compteurs en parallèle, chacun avec son état (chargement, erreur, réessai). */
export function useCounts(specs: CountSpec[], universityId?: string) {
  return useQueries({
    queries: specs.map((spec) => {
      const params = {
        ...spec.params,
        ...(spec.scoped && universityId ? { university_id: universityId } : {}),
      };
      return {
        queryKey: adminKeys.list(spec.resource, { count: true, ...params }),
        queryFn: () => fetchTotal(spec.path, params),
      };
    }),
  });
}

/** Utilisateurs de chaque université (même ordre que `universityIds`). */
export function useUniversityUserCounts(universityIds: string[]) {
  return useQueries({
    queries: universityIds.map((id) => ({
      queryKey: adminKeys.list("users", { count: true, university_id: id }),
      queryFn: () => fetchTotal("/users/", { university_id: id }),
    })),
  });
}

/** Année académique courante (les années sont globales). */
export function useCurrentYear() {
  return useQuery({
    queryKey: adminKeys.list("academic-years", { current: true }),
    queryFn: async () => {
      const data = await api<unknown>("/academic-years/", {
        query: { page: "1", page_size: "200" },
      });
      return readItems<AcademicYear>(data).find((year) => year.is_current);
    },
    staleTime: 5 * 60 * 1000,
  });
}
