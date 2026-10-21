// api/assessments.ts
import { api, del, patch, post } from "./http";
import { readItems } from "../lib/payload";
import type { Assessment, AssessmentStatus, AssessmentType, Question, QuestionType } from "./types";

export type CreateAssessmentInput = {
  class_subject_id: string;
  title: string;
  description?: string;
  assessment_type: AssessmentType;
  start_at?: string;
  end_at?: string;
  duration_minutes?: number;
  max_attempts: number;
  show_correction: boolean;
};
export type UpdateAssessmentInput = {
  title?: string;
  description?: string | null;
  assessment_type?: AssessmentType;
  start_at?: string | null;
  end_at?: string | null;
  duration_minutes?: number | null;
  max_attempts?: number;
  show_correction?: boolean;
};
export type ChoiceInput = { content: string; is_correct: boolean };
export type CreateQuestionInput = {
  content: string;
  question_type: QuestionType;
  points: number;
  choices: ChoiceInput[];
};
export type UpdateQuestionInput = { content?: string; points?: number; choices?: ChoiceInput[] };

export const assessmentsApi = {
  list: async (classSubjectId: string) =>
    readItems<Assessment>(
      await api<unknown>("/assessments/", {
        query: { class_subject_id: classSubjectId, page: "1", page_size: "100" },
      }),
    ),
  get: (id: string) => api<Assessment>(`/assessments/${id}`),
  create: (input: CreateAssessmentInput) => post<Assessment>("/assessments/create", input),
  update: (id: string, input: UpdateAssessmentInput) =>
    patch<Assessment>(`/assessments/${id}`, input),
  setStatus: (id: string, status: AssessmentStatus) =>
    patch<Assessment>(`/assessments/${id}/status`, { status }),
  remove: (id: string) => del(`/assessments/${id}`),
};

export const questionsApi = {
  list: async (assessmentId: string) =>
    readItems<Question>(await api<unknown>(`/assessments/${assessmentId}/questions`)),
  create: (assessmentId: string, input: CreateQuestionInput) =>
    post<Question>(`/assessments/${assessmentId}/questions`, input),
  update: (id: string, input: UpdateQuestionInput) => patch<Question>(`/questions/${id}`, input),
  remove: (id: string) => del(`/questions/${id}`),
};
