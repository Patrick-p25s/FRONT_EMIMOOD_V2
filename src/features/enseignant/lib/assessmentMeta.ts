// lib/assessmentMeta.ts
import type { Tone } from "@/components/emimood/atoms/tones";
import type { AssessmentStatus, AssessmentType } from "../api/types";

export const ASSESSMENT_TYPE_LABEL: Record<AssessmentType, string> = {
  quiz: "Quiz",
  exam: "Examen",
  assignment: "Devoir",
};

export const ASSESSMENT_STATUS: Record<AssessmentStatus, { label: string; tone: Tone }> = {
  draft: { label: "Brouillon", tone: "muted" },
  published: { label: "Publiée", tone: "success" },
  archived: { label: "Archivée", tone: "warning" },
};

const PHASES: Record<string, { label: string; tone: Tone }> = {
  draft: { label: "Brouillon", tone: "muted" },
  upcoming: { label: "À venir", tone: "info" },
  open: { label: "Ouverte", tone: "success" },
  closed: { label: "Terminée", tone: "muted" },
  archived: { label: "Archivée", tone: "warning" },
};

export const phaseMeta = (phase: string): { label: string; tone: Tone } =>
  PHASES[phase] ?? { label: phase, tone: "muted" };
