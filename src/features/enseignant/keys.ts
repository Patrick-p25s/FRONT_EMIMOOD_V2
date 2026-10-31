// features/enseignant/keys.ts
export const teacherKeys = {
  subjects: ["teacher", "subjects"] as const,
  mySubjects: () => ["teacher", "subjects", "mine"] as const,
  availableClasses: () => ["teacher", "subjects", "available-classes"] as const,
  courses: ["teacher", "courses"] as const,
  coursesOf: (classSubjectId: string) => ["teacher", "courses", "of", classSubjectId] as const,
  course: (id: string) => ["teacher", "courses", "detail", id] as const,
  chaptersAll: ["teacher", "chapters"] as const,
  chapters: (courseId: string) => ["teacher", "chapters", courseId] as const,
  resourcesAll: ["teacher", "resources"] as const,
  resources: (chapterId: string) => ["teacher", "resources", chapterId] as const,
  documents: (chapterId: string) => ["teacher", "documents", chapterId] as const,
  assessments: ["teacher", "assessments"] as const,
  assessmentsOf: (classSubjectId: string) =>
    ["teacher", "assessments", "of", classSubjectId] as const,
  assessment: (id: string) => ["teacher", "assessments", "detail", id] as const,
  questionsAll: ["teacher", "questions"] as const,
  questions: (assessmentId: string) => ["teacher", "questions", assessmentId] as const,
  attemptsAll: ["teacher", "attempts"] as const,
  attempts: (assessmentId: string, status?: string) =>
    ["teacher", "attempts", "of", assessmentId, status ?? "all"] as const,
  attemptReview: (id: string) => ["teacher", "attempts", "review", id] as const,
  resultsAll: ["teacher", "results"] as const,
  results: (assessmentId: string) => ["teacher", "results", assessmentId] as const,
};
// keys.ts
import type { FeedFilters } from "../publication/api/publications";

export const pubKeys = {
  all: ["publications"] as const,
  feed: (f: FeedFilters) =>
    ["publications", "feed", f.type ?? "all", f.classeId ?? "all", f.authorId ?? "all"] as const,
  comments: (id: string) => ["publications", "comments", id] as const,
};
