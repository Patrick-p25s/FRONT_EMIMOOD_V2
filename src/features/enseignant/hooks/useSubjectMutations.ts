import {
  subjectsApi,
  type AddClassesInput,
  type CreateSubjectInput,
  type UpdateSubjectInput,
} from "../api/subjects";
import { teacherKeys } from "../keys";
import { useTeacherMutation } from "./useTeacherMutation";

export function useSubjectMutations() {
  const refresh = [teacherKeys.subjects];
  const create = useTeacherMutation(
    (input: CreateSubjectInput) => subjectsApi.create(input),
    refresh,
    "Matière créée",
  );
  const update = useTeacherMutation(
    (v: { id: string; input: UpdateSubjectInput }) => subjectsApi.update(v.id, v.input),
    refresh,
    "Matière mise à jour",
  );
  const addClasses = useTeacherMutation(
    (v: { id: string; input: AddClassesInput }) => subjectsApi.addClasses(v.id, v.input),
    refresh,
    "Classes ajoutées",
  );
  const removeClass = useTeacherMutation(
    (v: { id: string; classeId: string }) => subjectsApi.removeClass(v.id, v.classeId),
    refresh,
    "Classe retirée",
  );
  const remove = useTeacherMutation(
    (id: string) => subjectsApi.remove(id),
    refresh,
    "Matière supprimée",
  );
  return { create, update, addClasses, removeClass, remove };
}
