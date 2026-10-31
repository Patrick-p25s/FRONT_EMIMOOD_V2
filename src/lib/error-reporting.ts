/**
 * Point d'extension unique pour le suivi d'erreurs côté navigateur.
 *
 * Le projet n'est lié à aucun fournisseur : un futur outil peut être branché
 * ici sans propager son SDK dans les composants.
 */
export function reportRuntimeError(error: unknown, context: Record<string, unknown> = {}) {
  if (import.meta.env.DEV) console.error("Erreur applicative", { error, context });
}
