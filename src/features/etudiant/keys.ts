// features/etudiant/keys.ts : les clés demandées par la spécification
export const studentKeys = {
  subjectsAll: ["my-subjects"] as const,
  subjects: (semester?: number) => ["my-subjects", semester ?? "all"] as const,
  study: (classSubjectId: string) => ["study", classSubjectId] as const,
  resources: (chapterId: string) => ["chapter-resources", chapterId] as const,
};
