// features/notifications/lib/target.ts : où mène une notification (chemins internes uniquement)
import type { AppNotification } from "../api/schemas";

export type NotificationTarget =
  "/subjects" | "/evaluations" | "/publications" | "/messages" | "/enseignant/evaluations";

/** Adaptez les préfixes aux valeurs réelles de `type` renvoyées par votre API. */
export function notificationTarget(
  n: AppNotification,
  role?: string,
): NotificationTarget | undefined {
  const type = n.type.toLowerCase();
  const teacher = role === "teacher";
  if (type.startsWith("assessment") || type.startsWith("evaluation") || type.startsWith("attempt"))
    return teacher ? "/enseignant/evaluations" : "/evaluations";
  if (teacher) return undefined;
  if (type.startsWith("chapter") || type.startsWith("course") || type.startsWith("subject"))
    return "/subjects";
  if (type.startsWith("publication") || type.startsWith("comment") || type.startsWith("like"))
    return "/publications";
  if (type.startsWith("message")) return "/messages";
  return undefined;
}
