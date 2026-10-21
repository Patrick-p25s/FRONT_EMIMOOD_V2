// api/courses.ts
import { api, del, patch, post, postForm } from "./http";
import { readItems } from "../lib/payload";
import type {
  Chapter,
  ChapterDocument,
  Course,
  CourseResource,
  CourseStatus,
  ResourceType,
} from "./types";

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
export type CreateResourceInput = {
  chapter_id: string;
  title: string;
  resource_type: ResourceType;
  url: string;
  description?: string;
};
export type UpdateResourceInput = {
  title?: string;
  description?: string | null;
  resource_type?: ResourceType;
  url?: string;
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

export const resourcesApi = {
  list: async (chapterId: string) =>
    readItems<CourseResource>(await api<unknown>(`/chapters/${chapterId}/resources`)),
  create: (input: CreateResourceInput) => post<CourseResource>("/resources/create", input),
  update: (id: string, input: UpdateResourceInput) =>
    patch<CourseResource>(`/resources/${id}`, input),
  remove: (id: string) => del(`/resources/${id}`),
};

export const documentsApi = {
  list: async (chapterId: string) =>
    readItems<ChapterDocument>(await api<unknown>(`/chapters/${chapterId}/documents`)),
  upload: (form: FormData) => postForm<ChapterDocument>("/chapter-documents/create", form),
  update: (id: string, input: { title?: string; description?: string | null }) =>
    patch<ChapterDocument>(`/chapter-documents/${id}`, input),
  remove: (id: string) => del(`/chapter-documents/${id}`),
};
