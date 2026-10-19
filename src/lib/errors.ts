// src/lib/errors.ts
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/api/client";

export function errorMessage(e: unknown) {
  return e instanceof ApiError ? e.detail : "Une erreur est survenue, réessayez";
}

/** Mappe les erreurs 422/409 de FastAPI vers les champs du formulaire. */
export function applyServerErrors<T extends FieldValues>(
  e: unknown,
  setError: UseFormSetError<T>,
  fields: string[],
) {
  if (!(e instanceof ApiError)) return;
  let mapped = false;
  Object.entries(e.fieldErrors ?? {}).forEach(([k, msg]) => {
    if (fields.includes(k)) {
      setError(k as Path<T>, { message: msg });
      mapped = true;
    }
  });
  if (!mapped) setError("root" as Path<T>, { message: e.detail });
}
