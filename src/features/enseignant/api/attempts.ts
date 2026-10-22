// api/attempts.ts
import { api, patch } from "./http";
import { readItems } from "../lib/payload";
import type { AssessmentResults, AttemptReview, AttemptRow } from "./types";

export type GradeItemInput = { question_id: string; points_awarded: number; feedback?: string };

export const attemptsApi = {
  list: async (assessmentId: string, status?: string) =>
    readItems<AttemptRow>(
      await api<unknown>(`/assessments/${assessmentId}/attempts`, {
        query: { page: "1", page_size: "100", ...(status ? { status } : {}) },
      }),
    ),
  review: (id: string) => api<AttemptReview>(`/attempts/${id}/review`),
  grade: (id: string, grades: GradeItemInput[]) =>
    patch<unknown>(`/attempts/${id}/grade`, { grades }),
  results: (assessmentId: string) => api<AssessmentResults>(`/assessments/${assessmentId}/results`),
};
