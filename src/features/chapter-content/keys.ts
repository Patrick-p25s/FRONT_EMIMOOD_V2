export const chapterContentKeys = {
  all: ["chapter-content"] as const,
  chapter: (chapterId: string) => ["chapter-content", chapterId] as const,
};
