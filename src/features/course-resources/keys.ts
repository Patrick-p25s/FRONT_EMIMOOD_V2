// Clés de cache du domaine des supports de cours.
export const courseResourceKeys = {
  all: ["course-resources"] as const,
  chapter: (chapterId: string) => ["course-resources", "chapter", chapterId] as const,
};
