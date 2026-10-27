// features/publications/hooks/useComments.ts
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { COMMENTS_PAGE_SIZE, commentsApi } from "../api/comment";
import { messageOf, retryPolicy } from "@/lib/api/message";

const commentKeys = {
  list: (publicationId: string) => ["publications", "comments", publicationId] as const,
};

export const useComments = (publicationId: string) =>
  useInfiniteQuery({
    queryKey: commentKeys.list(publicationId),
    queryFn: ({ pageParam }) => commentsApi.list(publicationId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last, all) =>
      last.pages !== null
        ? last.page < last.pages
          ? last.page + 1
          : undefined
        : last.items.length >= COMMENTS_PAGE_SIZE
          ? all.length + 1
          : undefined,
    retry: retryPolicy,
  });

export function useAddComment(publicationId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (v: { content: string; parentId?: string | undefined }) =>
      commentsApi.add(publicationId, v.content, v.parentId),
    onSuccess: () => client.invalidateQueries({ queryKey: commentKeys.list(publicationId) }),
    onError: (error) => toast.error(messageOf(error)),
  });
}
