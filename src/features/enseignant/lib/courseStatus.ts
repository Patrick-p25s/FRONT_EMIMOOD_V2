// lib/courseStatus.ts
import type { Tone } from "@/components/emimood/atoms/tones";
import type { CourseStatus } from "../api/types";

export const COURSE_STATUS: Record<CourseStatus, { label: string; tone: Tone }> = {
  draft: { label: "Brouillon", tone: "muted" },
  published: { label: "Publié", tone: "success" },
  archived: { label: "Archivé", tone: "warning" },
};
