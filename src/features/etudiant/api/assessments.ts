// features/etudiant/api/assessments.ts
import { z } from "zod";
import { api } from "@/lib/api/client";
import { pageItems, parseRequest, parseResponse, safeId } from "@/lib/api/validate";
import {
  assessmentSchema,
  myAttemptSchema,
  resultSchema,
  saveAnswersOutSchema,
  saveAnswersSchema,
  sessionSchema,
  startSchema,
  type AnswerInput,
} from "./assessmentSchemas";

export const studentAssessmentsApi = {
  list: async (classSubjectId: string) =>
    parseResponse(
      z.array(assessmentSchema),
      pageItems(
        await api<unknown>("/assessments/", {
          query: { class_subject_id: safeId(classSubjectId), page: 1, page_size: 100 },
        }),
      ),
    ),
  get: async (id: string) =>
    parseResponse(assessmentSchema, await api<unknown>(`/assessments/${safeId(id)}`)),
  myAttempts: async (assessmentId: string) =>
    parseResponse(
      z.array(myAttemptSchema),
      pageItems(await api<unknown>(`/assessments/${safeId(assessmentId)}/my-attempts`)),
    ),
  start: async (assessmentId: string) =>
    parseResponse(
      startSchema,
      await api<unknown>(`/assessments/${safeId(assessmentId)}/attempts/start`, { method: "POST" }),
    ),
  session: async (attemptId: string) =>
    parseResponse(sessionSchema, await api<unknown>(`/attempts/${safeId(attemptId)}`)),
  saveAnswers: async (attemptId: string, answers: AnswerInput[]) =>
    parseResponse(
      saveAnswersOutSchema,
      await api<unknown>(`/attempts/${safeId(attemptId)}/answers`, {
        method: "PUT",
        body: parseRequest(saveAnswersSchema, { answers }),
      }),
    ),
  submit: async (attemptId: string) => {
    await api<unknown>(`/attempts/${safeId(attemptId)}/submit`, { method: "POST" });
  },
  result: async (attemptId: string) =>
    parseResponse(resultSchema, await api<unknown>(`/attempts/${safeId(attemptId)}/result`)),
};
