// features/enseignant/capabilities.ts
/** Passez à `true` quand la route correspondante existe côté backend. */
export const capabilities = {
  /** `content` accepté dans POST /chapters/create et PATCH /chapters/{id}. */
  chapterText: true,
  /** Routes /chapter-documents/* disponibles. */
  documentUpload: true,
} as const;
