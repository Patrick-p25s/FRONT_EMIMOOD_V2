import { api, del, patch, post } from "./http";
import { readItems } from "../lib/payload";
import type { Chapter, Course, CourseStatus, ResourceType } from "./types";

export type CreateCourseInput = { class_subject_id: string; title: string; description?: string };
export type UpdateCourseInput = { title?: string; description?: string | null };
export type CreateChapterInput = {
  course_id: string;
  title: string;
  description?: string;
  position?: number;
  content?: string[];
};
export type UpdateChapterInput = {
  title?: string;
  description?: string | null;
  position?: number;
  content?: string[];
};
export const coursesApi = {
  list: async (classSubjectId: string) =>
    readItems<Course>(
      await api<unknown>("/courses/", {
        query: { class_subject_id: classSubjectId, page: "1", page_size: "100" },
      }),
    ),
  get: (id: string) => api<Course>(`/courses/${id}`),
  create: (input: CreateCourseInput) => post<Course>("/courses/create", input),
  update: (id: string, input: UpdateCourseInput) => patch<Course>(`/courses/${id}`, input),
  setStatus: (id: string, status: CourseStatus) =>
    patch<Course>(`/courses/${id}/status`, { status }),
  remove: (id: string) => del(`/courses/${id}`),
};

export const chaptersApi = {
  list: async (courseId: string) =>
    readItems<Chapter>(await api<unknown>(`/courses/${courseId}/chapters`)),
  create: (input: CreateChapterInput) => post<Chapter>("/chapters/create", input),
  update: (id: string, input: UpdateChapterInput) => patch<Chapter>(`/chapters/${id}`, input),
  remove: (id: string) => del(`/chapters/${id}`),
};
