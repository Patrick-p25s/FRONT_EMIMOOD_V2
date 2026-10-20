// features/enseignant/keys.ts
export const teacherKeys = {
  subjects: ["teacher", "subjects"] as const,
  mySubjects: () => ["teacher", "subjects", "mine"] as const,
  availableClasses: () => ["teacher", "subjects", "available-classes"] as const,
};
