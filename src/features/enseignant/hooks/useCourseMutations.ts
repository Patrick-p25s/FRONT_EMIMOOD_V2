// hooks/useCourseMutations.ts
import {
  chaptersApi,
  coursesApi,
  documentsApi,
  resourcesApi,
  type CreateChapterInput,
  type CreateCourseInput,
  type CreateResourceInput,
  type UpdateChapterInput,
  type UpdateCourseInput,
  type UpdateResourceInput,
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
    [...refresh, teacherKeys.resourcesAll],
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

export function useResourceMutations() {
  const refresh = [teacherKeys.resourcesAll];
  const create = useTeacherMutation(
    (input: CreateResourceInput) => resourcesApi.create(input),
    refresh,
    "Ressource ajoutée",
  );
  const update = useTeacherMutation(
    (v: { id: string; input: UpdateResourceInput }) => resourcesApi.update(v.id, v.input),
    refresh,
    "Ressource enregistrée",
  );
  const remove = useTeacherMutation(
    (id: string) => resourcesApi.remove(id),
    refresh,
    "Ressource supprimée",
  );
  return { create, update, remove };
}

export function useDocumentMutations() {
  const refresh = [teacherKeys.documentAll];
  const upload = useTeacherMutation(
    (form: FormData) => documentsApi.upload(form),
    refresh,
    "Document ajouté",
  );
  const update = useTeacherMutation(
    (v: { id: string; input: { title?: string; description?: string | null } }) =>
      documentsApi.update(v.id, v.input),
    refresh,
    "Document enregistré",
  );
  const remove = useTeacherMutation(
    (id: string) => documentsApi.remove(id),
    refresh,
    "Document supprimé",
  );
  return { upload, update, remove };
}
