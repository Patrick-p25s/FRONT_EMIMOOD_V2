import { api } from "@/lib/api/client";
import { parseRequest, parseResponse, safeId } from "@/lib/api/validate";
import {
  courseResourceSchema,
  courseResourcesSchema,
  createCourseResourceSchema,
  updateCourseResourceSchema,
  type CreateCourseResourceInput,
  type UpdateCourseResourceInput,
} from "./schemas";

const BASE = "/course-resources";

export const courseResourcesApi = {
  list: async (chapterId: string) =>
    parseResponse(
      courseResourcesSchema,
      await api<unknown>(`/chapters/${safeId(chapterId)}/resources`),
    ),
  create: async (input: CreateCourseResourceInput) =>
    parseResponse(
      courseResourceSchema,
      await api<unknown>(`${BASE}/create`, {
        method: "POST",
        body: parseRequest(createCourseResourceSchema, input),
      }),
    ),
  update: async (id: string, input: UpdateCourseResourceInput) =>
    parseResponse(
      courseResourceSchema,
      await api<unknown>(`${BASE}/${safeId(id)}`, {
        method: "PATCH",
        body: parseRequest(updateCourseResourceSchema, input),
      }),
    ),
  remove: async (id: string) => {
    await api<unknown>(`${BASE}/${safeId(id)}`, { method: "DELETE" });
  },
};
