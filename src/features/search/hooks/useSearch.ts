// features/search/hooks/useSearch.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounced } from "@/features/messaging/hooks/useMessaging";
import { searchApi } from "../api/search";
import { retryPolicy } from "@/lib/api/message";

export function useSearch(input: string) {
  const q = useDebounced(input.trim(), 300);
  const query = useQuery({
    queryKey: ["search", q],
    queryFn: () => searchApi.all(q),
    enabled: q.length >= 2,
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    retry: retryPolicy,
  });
  return { q, ...query };
}
