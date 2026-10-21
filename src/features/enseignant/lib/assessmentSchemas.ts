// lib/assessmentSchemas.ts
import { z } from "zod";

export const assessmentSchema = z
  .object({
    title: z.string().trim().min(2, "Au moins 2 caractères").max(200, "200 caractères maximum"),
    description: z.string().trim().max(5000, "5000 caractères maximum"),
    assessment_type: z.enum(["quiz", "exam", "assignment"]),
    start_at: z.string(),
    end_at: z.string(),
    duration_minutes: z
      .string()
      .trim()
      .refine(
        (value) =>
          value === "" || (/^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 600),
        "Entre 1 et 600 minutes",
      ),
    max_attempts: z
      .string()
      .trim()
      .refine(
        (value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 10,
        "Entre 1 et 10 tentatives",
      ),
    show_correction: z.boolean(),
  })
  .refine(
    (values) =>
      !values.start_at || !values.end_at || new Date(values.start_at) < new Date(values.end_at),
    {
      path: ["end_at"],
      message: "La fin doit être après le début",
    },
  );

export type AssessmentFormValues = z.infer<typeof assessmentSchema>;

export const questionSchema = z.object({
  content: z.string().trim().min(1, "Obligatoire").max(2000, "2000 caractères maximum"),
  question_type: z.enum([
    "single_choice",
    "multiple_choice",
    "true_false",
    "short_answer",
    "open_answer",
  ]),
  points: z
    .string()
    .trim()
    .refine((value) => {
      const number = Number(value.replace(",", "."));
      return Number.isFinite(number) && number > 0 && number <= 1000;
    }, "Entre 0 (exclu) et 1000"),
  choices: z
    .array(
      z.object({ content: z.string().max(500, "500 caractères maximum"), is_correct: z.boolean() }),
    )
    .max(10, "10 choix maximum"),
});

export type QuestionFormValues = z.infer<typeof questionSchema>;
