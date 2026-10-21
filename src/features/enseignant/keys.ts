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
  documentAll: ["teacher", "documents"] as const,
  documents: (chapterId: string) => ["teacher", "documents", chapterId] as const,
};
