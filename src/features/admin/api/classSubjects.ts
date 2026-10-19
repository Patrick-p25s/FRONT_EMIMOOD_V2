// api/classSubjects.ts : matières d'une classe + enseignants affectés
import { api, del, post } from "./http";
import { ClassSubject, TeacherAssignment } from "./types";

export type AddClassSubjectInput = { classe_id: string; subject_id: string; semester?: number };
export type AssignTeacherInput = { teacher_id: string; class_subject_id: string };

export const classSubjectsApi = {
  list: (classe_id: string) => api<[]>("/class-subjects/", { query: { classe_id } }),
  add: (input: AddClassSubjectInput) => post<ClassSubject>("/class-subjects/create", input),
  remove: (id: string) => del(`/class-subjects/${id}`),
};

export const teacherAssignmentsApi = {
  assign: (input: AssignTeacherInput) =>
    post<TeacherAssignment>("/teacher-assignments/create", input),
  unassign: (id: string) => del(`/teacher-assignments/${id}`),
};
