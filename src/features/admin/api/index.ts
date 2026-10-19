import { api } from "@/lib/api/client";
import type {
  AcademicYear,
  AdminUser,
  ClassSubject,
  Classe,
  ClasseWithCode,
  InvitationCode,
  Level,
  Mention,
  Statut,
  Subject,
  TeacherAssignment,
  University,
} from "@/features/admin/api/types";

const post = <T>(path: string, body?: unknown) => api<T>(path, { method: "POST", body });
const patch = <T>(path: string, body: unknown) => api<T>(path, { method: "PATCH", body });
const del = (path: string) => api<void>(path, { method: "DELETE" });

export const universitiesApi = {
  get: (id: string) => api<University>(`/universities/${id}`),
  create: (b: { name: string; code: string; description?: string; logo_url?: string }) => post<University>("/universities/create", b),
  update: (id: string, b: { name?: string; description?: string | null; logo_url?: string | null }) => patch<University>(`/universities/${id}`, b),
  setStatut: (id: string, statut: Statut) => patch<University>(`/universities/${id}/statut`, { statut }),
};

export const yearsApi = {
  create: (b: { university_id: string; name: string; start_date: string; end_date: string; is_current?: boolean }) =>
    post<AcademicYear>("/academic-years/create", b),
  update: (id: string, b: { name?: string; start_date?: string; end_date?: string }) => patch<AcademicYear>(`/academic-years/${id}`, b),
  setCurrent: (id: string) => post<AcademicYear>(`/academic-years/${id}/set-current`),
  remove: (id: string) => del(`/academic-years/${id}`),
};

export const structureApi = {
  createMention: (b: { university_id: string; name: string; code: string; description?: string }) => post<Mention>("/mentions/create", b),
  updateMention: (id: string, b: { name?: string; description?: string | null }) => patch<Mention>(`/mentions/${id}`, b),
  removeMention: (id: string) => del(`/mentions/${id}`),
  createLevel: (b: { mention_id: string; name: string; code: string }) => post<Level>("/levels/create", b),
  updateLevel: (id: string, b: { name: string }) => patch<Level>(`/levels/${id}`, b),
  removeLevel: (id: string) => del(`/levels/${id}`),
};

export const classesApi = {
  create: (b: { level_id: string; academic_year_id: string; name: string; code: string; description?: string }) =>
    post<ClasseWithCode>("/classes/create", b),
  update: (id: string, b: { name?: string; description?: string | null }) => patch<Classe>(`/classes/${id}`, b),
  setStatut: (id: string, statut: Statut) => patch<Classe>(`/classes/${id}/statut`, { statut }),
  getCode: (id: string) => api<{ code_invitation: string }>(`/classes/${id}/invitation-code`),
  regenerate: (id: string) => post<ClasseWithCode>(`/classes/${id}/regenerate-invitation-code`),
};

export const usersApi = {
  get: (id: string) => api<AdminUser>(`/users/${id}`),
  setStatut: (id: string, statut: Statut) => patch<AdminUser>(`/users/${id}/statut`, { statut }),
  setClasse: (id: string, classe_id: string) => patch<AdminUser>(`/users/${id}/classe`, { classe_id }),
};

export const invitationCodesApi = {
  create: (b: { university_id: string; role: "teacher" | "moderator"; max_uses?: number; expires_at?: string }) =>
    post<InvitationCode>("/invitation-codes/create", b),
  deactivate: (id: string) => api<InvitationCode>(`/invitation-codes/${id}/deactivate`, { method: "PATCH" }),
};

export const subjectsApi = {
  create: (b: { university_id: string; name: string; code?: string; description?: string }) => post<Subject>("/subjects/create", b),
  update: (id: string, b: { name?: string; description?: string | null }) => patch<Subject>(`/subjects/${id}`, b),
  remove: (id: string) => del(`/subjects/${id}`),
  listClassSubjects: (classe_id: string) => api<ClassSubject[]>("/class-subjects/", { query: { classe_id } }),
  addToClass: (b: { classe_id: string; subject_id: string; semester?: number }) => post<ClassSubject>("/class-subjects/create", b),
  removeFromClass: (id: string) => del(`/class-subjects/${id}`),
  assignTeacher: (b: { teacher_id: string; class_subject_id: string }) => post<TeacherAssignment>("/teacher-assignments/create", b),
  unassignTeacher: (id: string) => del(`/teacher-assignments/${id}`),
};
