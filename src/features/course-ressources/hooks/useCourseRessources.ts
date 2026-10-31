import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CourseResource,
  CreateCourseResourceInput,
  UpdateCourseResourceInput,
} from "../api/schemas";
import { courseResourceKeys } from "../keys";
import { courseResourcesApi } from "../api/courseRessources";
import { messageOf, retryPolicy } from "@/lib/api/message";

const byPosition = (items: CourseResource[]) => [...items].sort((a, b) => a.position - b.position);

/** Même signature que l'ancien hook étudiant. */
export const useChapterResources = (chapterId: string | undefined) =>
  useQuery({
    queryKey: courseResourceKeys.chapter(chapterId ?? ""),
    queryFn: () => courseResourcesApi.list(chapterId ?? ""),
    enabled: Boolean(chapterId),
    select: byPosition,
    retry: retryPolicy,
  });

export function useCourseResourceMutations() {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: courseResourceKeys.all });
  const onError = (error: unknown) => toast.error(messageOf(error));
  return {
    create: useMutation({
      mutationFn: (input: CreateCourseResourceInput) => courseResourcesApi.create(input),
      onSuccess: async () => {
        await refresh();
        toast.success("Ressource ajoutée");
      },
      onError,
    }),
    update: useMutation({
      mutationFn: (v: { id: string; input: UpdateCourseResourceInput }) =>
        courseResourcesApi.update(v.id, v.input),
      onSuccess: async () => {
        await refresh();
        toast.success("Ressource enregistrée");
      },
      onError,
    }),
    remove: useMutation({
      mutationFn: (id: string) => courseResourcesApi.remove(id),
      onSuccess: async () => {
        await refresh();
        toast.success("Ressource supprimée");
      },
      onError,
    }),
  };
}
