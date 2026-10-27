// hooks/usePublications.ts
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { publicationsApi, type FeedFilters } from "../api/publications";
import { pubKeys } from "../../enseignant/keys";

export const usePublicationFeed = (filters: FeedFilters) =>
  useInfiniteQuery({
    queryKey: pubKeys.feed(filters),
    queryFn: ({ pageParam }) => publicationsApi.feed(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.pages ? last.page + 1 : undefined),
  });

export const useComments = (publicationId: string, enabled: boolean) =>
  useQuery({
    queryKey: pubKeys.comments(publicationId),
    queryFn: () => publicationsApi.comments(publicationId),
    enabled,
    select: (page) => [...page.items].sort((a, b) => a.created_at.localeCompare(b.created_at)),
  });
