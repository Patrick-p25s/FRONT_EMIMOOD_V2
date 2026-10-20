// hooks/useClassSubjects.ts
import { useQuery } from "@tanstack/react-query";
import {
  classSubjectsApi,
  teacherAssignmentsApi,
  type AddClassSubjectInput,
  type AssignTeacherInput,
} from "../api/classSubjects";
import { subjectsApi } from "../api/subjects";
import { usersApi } from "../api/users";
import { adminKeys } from "../keys";
import { useAdminMutation } from "./useAdminList";

export const useClassSubjects = (classeId: string) =>
  useQuery({
    queryKey: adminKeys.list("class-subjects", { classe_id: classeId }),
    queryFn: () => classSubjectsApi.list(classeId),
  });

export const useAssignments = (classSubjectId: string) =>
  useQuery({
    queryKey: adminKeys.list("teacher-assignments", { class_subject_id: classSubjectId }),
    queryFn: () => teacherAssignmentsApi.list(classSubjectId),
  });

export const useUniversitySubjects = (universityId: string) =>
  useQuery({
    queryKey: adminKeys.list("subjects", { university_id: universityId }),
    queryFn: () => subjectsApi.list(universityId),
  });

export const useUniversityTeachers = (universityId: string) =>
  useQuery({
    queryKey: adminKeys.list("users", { university_id: universityId, role: "teacher", all: true }),
    queryFn: () => usersApi.list({ university_id: universityId, role: "teacher" }),
  });

export function useClassSubjectMutations() {
  const add = useAdminMutation(
    (body: AddClassSubjectInput) => classSubjectsApi.add(body),
    ["class-subjects"],
    "Matière ajoutée",
  );
  const remove = useAdminMutation(
    (id: string) => classSubjectsApi.remove(id),
    ["class-subjects", "teacher-assignments"],
    "Matière retirée",
  );
  const assign = useAdminMutation(
    (body: AssignTeacherInput) => teacherAssignmentsApi.assign(body),
    ["teacher-assignments"],
    "Enseignant affecté",
  );
  const unassign = useAdminMutation(
    (id: string) => teacherAssignmentsApi.unassign(id),
    ["teacher-assignments"],
    "Affectation retirée",
  );
  return { add, remove, assign, unassign };
}
