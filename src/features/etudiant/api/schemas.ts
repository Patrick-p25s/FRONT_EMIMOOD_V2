// features/etudiant/api/schemas.ts : le contrat de la spécification, ni plus ni moins
import { z } from "zod";

const id = z.string().uuid();
const percent = z.number().min(0).max(100);
const count = z.number().int().min(0);

export const subjectCardSchema = z.object({
  class_subject_id: id,
  subject_id: id,
  code: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  semester: z.number().int().nullable(),
  chapters_count: count,
  completed_chapters: count,
  progress_percent: percent,
  teachers: z.array(z.object({ id, name: z.string() })),
});

export const mySubjectsSchema = z.object({
  classe_id: id,
  classe_name: z.string(),
  academic_year_name: z.string(),
  semesters: z.array(z.number().int()),
  subjects: z.array(subjectCardSchema),
});

export const studyChapterSchema = z.object({
  id,
  course_id: id,
  course_title: z.string(),
  number: z.number().int(),
  title: z.string(),
  description: z.string().nullable(),
  completed: z.boolean(),
});

export const studySchema = z.object({
  class_subject_id: id,
  subject_id: id,
  subject_name: z.string(),
  subject_code: z.string().nullable(),
  total_chapters: count,
  completed_chapters: count,
  percent,
  current_chapter_id: id.nullable(),
  chapters: z.array(studyChapterSchema),
});

export const chapterProgressSchema = z.object({
  chapter_id: id,
  completed: z.literal(true),
  completed_at: z.string(),
  next_chapter_id: id.nullable(),
  total_chapters: count,
  completed_chapters: count,
  percent,
  subject_completed: z.boolean(),
});

export type SubjectCardData = z.infer<typeof subjectCardSchema>;
export type MySubjects = z.infer<typeof mySubjectsSchema>;
export type StudyChapter = z.infer<typeof studyChapterSchema>;
export type Study = z.infer<typeof studySchema>;
export type ChapterProgress = z.infer<typeof chapterProgressSchema>;
