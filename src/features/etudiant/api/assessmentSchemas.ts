// features/etudiant/api/assessmentSchemas.ts
import { z } from "zod";

const id = z.string().uuid();
const iso = z.string();
const QUESTION_TYPE = z.enum([
  "single_choice",
  "multiple_choice",
  "true_false",
  "short_answer",
  "open_answer",
]);

// Seuls les champs utilisés sont exigés : le reste est ignoré.
export const assessmentSchema = z.object({
  id,
  class_subject_id: id,
  title: z.string(),
  description: z.string().nullable(),
  assessment_type: z.enum(["quiz", "exam", "assignment"]),
  status: z.string(),
  start_at: iso.nullable(),
  end_at: iso.nullable(),
  duration_minutes: z.number().int().nullable(),
  max_attempts: z.number().int(),
  show_correction: z.boolean(),
  phase: z.string(),
});

export const attemptSchema = z.object({
  id,
  assessment_id: id,
  attempt_number: z.number().int(),
  status: z.string(),
  started_at: iso,
  expires_at: iso.nullable(),
  submitted_at: iso.nullable(),
});

export const sessionQuestionSchema = z.object({
  id,
  content: z.string(),
  question_type: QUESTION_TYPE,
  points: z.number(),
  position: z.number().int(),
  choices: z.array(z.object({ id, content: z.string(), position: z.number().int() })),
});

export const savedAnswerSchema = z.object({
  question_id: id,
  selected_choice_ids: z.array(id),
  answer_text: z.string().nullable(),
});

export const sessionSchema = z.object({
  attempt: attemptSchema,
  server_time: iso,
  questions: z.array(sessionQuestionSchema),
  answers: z.array(savedAnswerSchema),
});

export const saveAnswersOutSchema = z.object({
  saved: z.number().int(),
  expires_at: iso.nullable(),
  server_time: iso,
});

export const myAttemptSchema = z.object({
  id,
  attempt_number: z.number().int(),
  status: z.string(),
  started_at: iso,
  submitted_at: iso.nullable(),
  score: z.number().nullable(),
});

export const answerDetailSchema = z.object({
  question_id: id,
  content: z.string(),
  question_type: QUESTION_TYPE,
  points: z.number(),
  choices: z.array(
    z.object({ id, content: z.string(), is_correct: z.boolean(), position: z.number().int() }),
  ),
  selected_choice_ids: z.array(id),
  answer_text: z.string().nullable(),
  points_awarded: z.number().nullable(),
  feedback: z.string().nullable(),
});

export const resultSchema = z.object({
  attempt_id: id,
  assessment_id: id,
  attempt_number: z.number().int(),
  status: z.string(),
  submitted_at: iso.nullable(),
  score: z.number().nullable(),
  max_score: z.number(),
  details: z.array(answerDetailSchema).nullable(),
});

// « Démarrer » : on accepte la tentative seule ou la session complète.
export const startSchema = z.union([
  z.object({ attempt: attemptSchema }).transform((value) => value.attempt),
  attemptSchema,
]);

// Ce que l'on envoie : identifiants valides, texte borné.
export const saveAnswersSchema = z.object({
  answers: z
    .array(
      z.object({
        question_id: id,
        selected_choice_ids: z.array(id).max(20),
        answer_text: z.string().max(5000).nullable(),
      }),
    )
    .max(100),
});

export type StudentAssessment = z.infer<typeof assessmentSchema>;
export type Attempt = z.infer<typeof attemptSchema>;
export type SessionQuestion = z.infer<typeof sessionQuestionSchema>;
export type AttemptSession = z.infer<typeof sessionSchema>;
export type MyAttempt = z.infer<typeof myAttemptSchema>;
export type AnswerDetail = z.infer<typeof answerDetailSchema>;
export type AttemptResult = z.infer<typeof resultSchema>;
export type AnswerInput = z.infer<typeof saveAnswersSchema>["answers"][number];
