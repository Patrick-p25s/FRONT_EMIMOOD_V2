// lib/attemptMeta.ts
import type { Tone } from "@/components/emimood/atoms/tones";

const STATUS: Record<string, { label: string; tone: Tone }> = {
  in_progress: { label: "En cours", tone: "info" },
  submitted: { label: "À corriger", tone: "warning" },
  graded: { label: "Corrigée", tone: "success" },
  expired: { label: "Expirée", tone: "muted" },
};

export const attemptStatusMeta = (status: string): { label: string; tone: Tone } =>
  STATUS[status] ?? { label: status, tone: "muted" };

export const formatScore = (value: number | null | undefined): string =>
  value === null || value === undefined
    ? "—"
    : value.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
