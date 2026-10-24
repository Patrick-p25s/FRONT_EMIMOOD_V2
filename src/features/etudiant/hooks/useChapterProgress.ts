// hooks/useChapterProgress.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentApi } from "../api/student";
import type { Study } from "../api/schemas";
import { studentKeys } from "../keys";
import { messageOf } from "../lib/messages";

export function useChapterProgress(classSubjectId: string) {
  const client = useQueryClient();

  const patchStudy = (
    chapterId: string,
    completed: boolean,
    totals?: { completed_chapters: number; percent: number },
  ) =>
    client.setQueryData<Study>(studentKeys.study(classSubjectId), (old) =>
      old
        ? {
            ...old,
            ...(totals ?? {}),
            chapters: old.chapters.map((c) => (c.id === chapterId ? { ...c, completed } : c)),
          }
        : old,
    );

  const complete = useMutation({
    mutationFn: (chapterId: string) => studentApi.complete(chapterId),
    onSuccess: async (result) => {
      // progression prise dans la RÉPONSE du serveur
      patchStudy(result.chapter_id, true, {
        completed_chapters: result.completed_chapters,
        percent: result.percent,
      });
      await client.invalidateQueries({ queryKey: studentKeys.subjectsAll });
    },
    onError: (error) => toast.error(messageOf(error)),
  });

  const uncomplete = useMutation({
    mutationFn: async (chapterId: string) => {
      await studentApi.uncomplete(chapterId);
      return chapterId;
    },
    onSuccess: async (chapterId) => {
      patchStudy(chapterId, false);
      // le pourcentage est recalculé par le serveur
      await Promise.all([
        client.invalidateQueries({ queryKey: studentKeys.study(classSubjectId) }),
        client.invalidateQueries({ queryKey: studentKeys.subjectsAll }),
      ]);
    },
    onError: (error) => toast.error(messageOf(error)),
  });

  return { complete, uncomplete };
}
