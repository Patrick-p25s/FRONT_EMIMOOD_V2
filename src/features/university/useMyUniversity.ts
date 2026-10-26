// features/university/hooks/useMyUniversity.ts
import { useQuery } from "@tanstack/react-query";
import { universitiesApi } from "../admin/api";
import { retryPolicy } from "../etudiant/lib/messages";

export const useMyUniversity = (id: string | null | undefined) =>
  useQuery({
    queryKey: ["university", id],
    queryFn: () => universitiesApi.get(id as string),
    enabled: Boolean(id),
    staleTime: 60 * 60_000,
    retry: retryPolicy,
  });
