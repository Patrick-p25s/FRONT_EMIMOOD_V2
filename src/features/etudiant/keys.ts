// features/etudiant/keys.ts : les clés demandées par la spécification
export const studentKeys = {
  subjectsAll: ["my-subjects"] as const,
  subjects: (semester?: number) => ["my-subjects", semester ?? "all"] as const,
  study: (classSubjectId: string) => ["study", classSubjectId] as const,
  resources: (chapterId: string) => ["chapter-resources", chapterId] as const,
  assessmentsAll: ["student", "assessments"] as const,
  assessmentsOf: (classSubjectId: string) =>
    ["student", "assessments", "of", classSubjectId] as const,
  assessment: (id: string) => ["student", "assessments", "detail", id] as const,
  attemptsAll: ["student", "attempts"] as const,
  attemptsOf: (assessmentId: string) => ["student", "attempts", "of", assessmentId] as const,
  session: (attemptId: string) => ["student", "session", attemptId] as const,
  result: (attemptId: string) => ["student", "result", attemptId] as const,
};
