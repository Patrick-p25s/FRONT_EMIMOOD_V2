// features/etudiant/api/student.ts
import { z } from "zod";
import { api } from "@/lib/api/client";
import { parseResponse, safeId } from "@/lib/api/validate";
import { chapterProgressSchema, mySubjectsSchema, studySchema } from "./schemas";

const semesterSchema = z.number().int().min(1).max(12).optional();

export const studentApi = {
  // ① le semestre est contrôlé avant l'appel
  mine: async (semester?: number) =>
    parseResponse(
      mySubjectsSchema,
      await api<unknown>("/class-subjects/mine", {
        query: { semester: semesterSchema.parse(semester) },
      }),
    ),

  study: async (classSubjectId: string) =>
    parseResponse(
      studySchema,
      await api<unknown>(`/class-subjects/${safeId(classSubjectId)}/study`),
    ),
  complete: async (chapterId: string) =>
    parseResponse(
      chapterProgressSchema,
      await api<unknown>(`/chapters/${safeId(chapterId)}/progress`, { method: "PUT" }),
    ),

  uncomplete: async (chapterId: string) => {
    await api<unknown>(`/chapters/${safeId(chapterId)}/progress`, { method: "DELETE" });
  },
};
