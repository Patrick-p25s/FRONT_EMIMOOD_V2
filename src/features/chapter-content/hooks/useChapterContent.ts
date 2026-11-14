import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { chapterContentApi } from "../api/chapterContent";
import { chapterContentKeys } from "../keys";
import { messageOf, retryPolicy } from "@/lib/api/message";

export const useChapterContent = (chapterId: string | undefined) =>
  useQuery({
    queryKey: chapterContentKeys.chapter(chapterId ?? ""),
    queryFn: () => chapterContentApi.list(chapterId ?? ""),
    enabled: Boolean(chapterId),
    staleTime: 5 * 60_000,
    retry: retryPolicy,
  });

export function useChapterContentMutations(chapterId: string) {
  const client = useQueryClient();
  const refresh = () =>
    client.invalidateQueries({ queryKey: chapterContentKeys.chapter(chapterId) });
  const onError = (error: unknown) => toast.error(messageOf(error));
  return {
    create: useMutation({
      mutationFn: (texts: string[]) => chapterContentApi.create(chapterId, texts),
      onSuccess: async () => {
        await refresh();
        toast.success("Contenu ajouté");
      },
      onError,
    }),
    update: useMutation({
      mutationFn: (v: { id: string; content: string }) => chapterContentApi.update(v.id, v.content),
      onSuccess: async () => {
        await refresh();
        toast.success("Contenu enregistré");
      },
      onError,
    }),
  };
}
