import { api } from "./client";
import type { AcademicClass, AcademicYear, Level, Mention, University, User } from "./identity";

export type UniversityStatus = "active" | "inactive" | "suspended";
export type ManagedUniversity = University & { status: UniversityStatus };

export type CreateUniversityPayload = Pick<University, "name" | "code" | "description">;
export type CreateMentionPayload = Pick<Mention, "name" | "code" | "description">;
export type CreateLevelPayload = Pick<Level, "name" | "code">;
export type CreateAcademicYearPayload = Pick<AcademicYear, "name" | "start_date" | "end_date">;
export type CreateClassPayload = Pick<AcademicClass, "level_id" | "academic_year_id" | "name" | "code" | "description">;
export type CreateTeacherPayload = Pick<User, "first_name" | "last_name" | "email"> & { phone_number?: string };

/** Endpoints réservés au super administrateur. */
export const universityAdminApi = {
  listUniversities: () => api.get<ManagedUniversity[]>("/universities"),
  createUniversity: (payload: CreateUniversityPayload) => api.post<ManagedUniversity>("/universities", payload),
  updateUniversity: (id: string, payload: Partial<CreateUniversityPayload & { status: UniversityStatus }>) =>
    api.patch<ManagedUniversity>(`/universities/${id}`, payload),
  listMentions: (universityId: string) => api.get<Mention[]>(`/universities/${universityId}/mentions`),
  createMention: (universityId: string, payload: CreateMentionPayload) =>
    api.post<Mention>(`/universities/${universityId}/mentions`, payload),
  createLevel: (mentionId: string, payload: CreateLevelPayload) => api.post<Level>(`/mentions/${mentionId}/levels`, payload),
  listAcademicYears: (universityId: string) => api.get<AcademicYear[]>(`/universities/${universityId}/academic-years`),
  createAcademicYear: (universityId: string, payload: CreateAcademicYearPayload) =>
    api.post<AcademicYear>(`/universities/${universityId}/academic-years`, payload),
  createClass: (payload: CreateClassPayload) => api.post<AcademicClass>("/classes", payload),
  createTeacher: (universityId: string, payload: CreateTeacherPayload) =>
    api.post<User>(`/universities/${universityId}/teachers`, payload),
  setUserStatus: (userId: string, statut: User["statut"]) => api.patch<User>(`/users/${userId}`, { statut }),
};
