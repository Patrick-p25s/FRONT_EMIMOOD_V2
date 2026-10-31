// hooks/useCourseMutations.ts
import {
  chaptersApi,
  coursesApi,
  type CreateChapterInput,
  type CreateCourseInput,
  type UpdateChapterInput,
  type UpdateCourseInput,
} from "../api/courses";
import type { Chapter, CourseStatus } from "../api/types";
import { teacherKeys } from "../keys";
import { useTeacherMutation } from "./useTeacherMutation";

export function useCourseMutations() {
  const refresh = [teacherKeys.courses];
  const create = useTeacherMutation(
    (input: CreateCourseInput) => coursesApi.create(input),
    refresh,
    "Cours créé",
  );
  const update = useTeacherMutation(
    (v: { id: string; input: UpdateCourseInput }) => coursesApi.update(v.id, v.input),
    refresh,
    "Cours enregistré",
  );
  const setStatus = useTeacherMutation(
    (v: { id: string; status: CourseStatus }) => coursesApi.setStatus(v.id, v.status),
    refresh,
    "Statut du cours mis à jour",
  );
  const remove = useTeacherMutation(
    (id: string) => coursesApi.remove(id),
    refresh,
    "Cours supprimé",
  );
  return { create, update, setStatus, remove };
}

export function useChapterMutations() {
  const refresh = [teacherKeys.chaptersAll, teacherKeys.courses];
  const create = useTeacherMutation(
    (input: CreateChapterInput) => chaptersApi.create(input),
    refresh,
    "Chapitre ajouté",
  );
  const update = useTeacherMutation(
    (v: { id: string; input: UpdateChapterInput }) => chaptersApi.update(v.id, v.input),
    refresh,
    "Chapitre enregistré",
  );
  const remove = useTeacherMutation(
    (id: string) => chaptersApi.remove(id),
    [...refresh],
    "Chapitre supprimé",
  );
  /** Échange la position de deux chapitres voisins. */
  const swap = useTeacherMutation(
    (v: { a: Chapter; b: Chapter }) =>
      Promise.all([
        chaptersApi.update(v.a.id, { position: v.b.position }),
        chaptersApi.update(v.b.id, { position: v.a.position }),
      ]),
    refresh,
  );
  return { create, update, remove, swap };
}
