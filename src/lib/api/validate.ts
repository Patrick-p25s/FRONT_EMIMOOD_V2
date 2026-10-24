// src/lib/api/validate.ts
import { z } from "zod";
import { ApiError } from "./client";

export const idSchema = z.string().uuid();

/** ① Un identifiant venant de l'URL ne part jamais dans un chemin sans être un UUID. */
export function safeId(value: string): string {
  const result = idSchema.safeParse(value);
  if (!result.success) throw new ApiError(404, "Contenu indisponible");
  return result.data;
}

/** ③ La réponse du serveur doit avoir la forme attendue. */
export function parseResponse<S extends z.ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) throw new ApiError(502, "Réponse inattendue du serveur, réessayez");
  return result.data;
}

/** Valide ce que l'on s'apprête à ENVOYER. */
export function parseRequest<S extends z.ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) throw new ApiError(422, "Données invalides : vérifiez vos réponses");
  return result.data;
}

/** Une liste peut arriver nue ou dans { items }. */
export const pageItems = (raw: unknown): unknown[] =>
  Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { items?: unknown } | null)?.items)
      ? (raw as { items: unknown[] }).items
      : [];
