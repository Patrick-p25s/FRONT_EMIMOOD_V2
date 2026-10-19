import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api/client";
import { normalizeList, type Paginated } from "@/lib/api/list";
import { adminKeys, type Resource } from "@/features/admin/keys";

type Params = Record<string, string | number | boolean | undefined>;

/** Liste paginée (ou simple tableau normalisé). */
export function useAdminList<T>(resource: Resource, path: string, params: Params, enabled = true) {
  return useQuery({
    queryKey: adminKeys.list(resource, params),
    queryFn: async () =>
      normalizeList<T>(
        await api<Paginated<T> | T[]>(path, { query: params }),
        Number(params["page"] ?? 1),
        Number(params["page_size"] ?? 20),
      ),
    placeholderData: keepPreviousData,
    enabled,
  });
}

export function useAdminDetail<T>(resource: Resource, path: string, id: string | undefined) {
  return useQuery({
    queryKey: adminKeys.detail(resource, id ?? ""),
    queryFn: () => api<T>(path),
    enabled: !!id,
  });
}

/** Mutation avec toast et invalidation précise des ressources concernées. */
export function useAdminMutation<V, R = unknown>(
  fn: (v: V) => Promise<R>,
  invalidate: Resource[],
  success?: string,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      invalidate.forEach((r) => void qc.invalidateQueries({ queryKey: adminKeys.resource(r) }));
      if (success) toast.success(success);
    },
    onError: (e) => {
      // Les erreurs de champ sont affichées dans le formulaire ; ici le message global.
      toast.error(e instanceof ApiError ? e.detail : "Une erreur est survenue, réessayez");
    },
  });
}
