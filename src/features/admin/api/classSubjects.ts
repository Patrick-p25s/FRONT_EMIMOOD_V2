// api/classSubjects.ts : matières d'une classe + enseignants affectés
import { readItems } from "../lib/payload";
import { api, del, post } from "./http";
import { ClassSubject, TeacherAssignment } from "./types";

export type AddClassSubjectInput = { classe_id: string; subject_id: string; semester?: number };
export type AssignTeacherInput = { teacher_id: string; class_subject_id: string };

export const classSubjectsApi = {
  list: async (classe_id: string) =>
    readItems<ClassSubject>(await api<unknown>("/class-subjects/", { query: { classe_id } })),
  add: (input: AddClassSubjectInput) => post<ClassSubject>("/class-subjects/create", input),
  remove: (id: string) => del(`/class-subjects/${id}`),
};

export const teacherAssignmentsApi = {
  list: async (class_subject_id: string) =>
    readItems<TeacherAssignment>(
      await api<unknown>("/teacher-assignments/", {
        query: { class_subject_id, page: "1", page_size: "100" },
      }),
    ),
  assign: (input: AssignTeacherInput) =>
    post<TeacherAssignment>("/teacher-assignments/create", input),
  unassign: (id: string) => del(`/teacher-assignments/${id}`),
};
