import type { MyAttempt } from "../api/assessmentSchemas";

export const TYPE_LABEL: Record<string, string> = {
  quiz: "Quiz",
  exam: "Examen",
  assignment: "Devoir",
};
export const PHASE_LABEL: Record<string, string> = {
  upcoming: "À venir",
  open: "Ouverte",
  closed: "Terminée",
};

export const typeLabel = (type: string) => TYPE_LABEL[type] ?? type;

export const formatScore = (value: number): string =>
  value.toLocaleString("fr-FR", { maximumFractionDigits: 2 });

/** Tentative commencée et pas encore rendue : on peut la reprendre. */
export const isOpenAttempt = (attempt: MyAttempt): boolean =>
  attempt.submitted_at === null && attempt.status !== "expired";

export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}
