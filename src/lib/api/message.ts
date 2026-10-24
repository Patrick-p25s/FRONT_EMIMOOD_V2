// src/lib/api/messages.ts
import { ApiError } from "./client";

export const messageOf = (error: unknown): string =>
  error instanceof ApiError ? error.detail : "Service momentanément indisponible";

export const isNotFound = (error: unknown): boolean =>
  error instanceof ApiError && error.status === 404;

/** Pas de nouvelle tentative pour les erreurs « normales » (404, 403, 422…). */
export const retryPolicy = (count: number, error: unknown): boolean =>
  !(error instanceof ApiError && error.status > 0 && error.status < 500) && count < 2;
