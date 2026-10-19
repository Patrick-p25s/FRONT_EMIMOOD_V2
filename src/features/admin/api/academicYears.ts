// api/academicYears.ts : plus de university_id
import { del, patch, post } from "./http";
import { AcademicYear } from "./types";

export type CreateYearInput = {
  name: string;
  start_date: string;
  end_date: string;
  is_current?: boolean;
};
export type UpdateYearInput = { name?: string; start_date?: string; end_date?: string };

export const yearsApi = {
  create: (input: CreateYearInput) => post<AcademicYear>("/academic-years/create", input),
  update: (id: string, input: UpdateYearInput) =>
    patch<AcademicYear>(`/academic-years/${id}`, input),
  setCurrent: (id: string) => post<AcademicYear>(`/academic-years/${id}/set-current`),
  remove: (id: string) => del(`/academic-years/${id}`),
};
