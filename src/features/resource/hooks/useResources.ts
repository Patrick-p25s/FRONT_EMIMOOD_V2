import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { ResourceDoc, ResourcesPageData, UploadInput } from "../api/schemas";
import { type ResourceFilters, resourcesApi } from "../api/resource";
import { messageOf, retryPolicy } from "@/lib/api/message";

export const resourceKeys = {
  all: ["resources"] as const,
  list: (filters: ResourceFilters) => ["resources", "list", filters] as const,
};

export const useResources = (filters: ResourceFilters) =>
  useInfiniteQuery({
    queryKey: resourceKeys.list(filters),
    queryFn: ({ pageParam }) => resourcesApi.list(filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.pages ? last.page + 1 : undefined),
    placeholderData: keepPreviousData,
    retry: retryPolicy,
  });

/** Le signet répond tout de suite ; la liste est ensuite resynchronisée (utile dans « Enregistrées »). */
export function useToggleSave() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (v: { id: string; saved: boolean }) =>
      v.saved ? resourcesApi.unsave(v.id) : resourcesApi.save(v.id),
    onMutate: (v) => {
      client.setQueriesData<InfiniteData<ResourcesPageData, number>>(
        { queryKey: ["resources", "list"] },
        (old) =>
          old && {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === v.id ? { ...item, saved: !v.saved } : item,
              ),
            })),
          },
      );
      client.setQueriesData<ResourceDoc[]>({ queryKey: ["resources", "chapter"] }, (old) =>
        old?.map((item) => (item.id === v.id ? { ...item, saved: !v.saved } : item)),
      );
    },
    onError: (error) => toast.error(messageOf(error)),
    onSettled: () => client.invalidateQueries({ queryKey: resourceKeys.all }),
  });
}

export function useResourceMutations() {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: resourceKeys.all });
  const onError = (error: unknown) => toast.error(messageOf(error));
  return {
    update: useMutation({
      mutationFn: (v: { id: string; title: string; description: string }) =>
        resourcesApi.update(v.id, { title: v.title, description: v.description }),
      onSuccess: async () => {
        await refresh();
        toast.success("Ressource mise à jour");
      },
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => resourcesApi.remove(id),
      onSuccess: async () => {
        await refresh();
        toast.success("Ressource supprimée");
      },
      onError,
    }),
    upload: useMutation({
      mutationFn: (input: UploadInput) => resourcesApi.upload(input),
      onSuccess: async () => {
        await refresh(); // la liste du chapitre et la page Ressources
        toast.success("Support ajouté");
      },
      onError,
    }),
  };
}

export const useChapterDocuments = (chapterId: string) =>
  useQuery({
    queryKey: ["resources", "chapter", chapterId] as const,
    queryFn: () => resourcesApi.chapter(chapterId),
    retry: retryPolicy,
  });
