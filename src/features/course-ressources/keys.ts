// features/course-resources/keys.ts
export const courseResourceKeys = {
  all: ["course-resources"] as const,
  chapter: (chapterId: string) => ["course-resources", "chapter", chapterId] as const,
};
