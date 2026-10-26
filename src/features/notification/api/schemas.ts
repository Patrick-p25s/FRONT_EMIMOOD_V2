// features/notifications/api/schemas.ts
import { z } from "zod";

const raw = z.object({
  id: z.string().uuid(),
  type: z.string().optional(),
  title: z.string(),
  body: z.string().nullish(),
  message: z.string().nullish(),
  is_read: z.boolean().optional(),
  read: z.boolean().optional(),
  created_at: z.string(),
  data: z.record(z.string(), z.unknown()).nullish(),
});

export const notificationSchema = raw.transform((n) => ({
  id: n.id,
  type: n.type ?? "",
  title: n.title,
  text: n.body ?? n.message ?? "",
  read: n.is_read ?? n.read ?? false,
  created_at: n.created_at,
  data: n.data ?? {},
}));

export const notificationsListSchema = z
  .union([z.array(notificationSchema), z.object({ items: z.array(notificationSchema) })])
  .transform((value) => (Array.isArray(value) ? value : value.items));

const count = z.number().int().nonnegative();
export const unreadCountSchema = z
  .union([
    count,
    z.object({ unread_count: count.optional(), count: count.optional(), unread: count.optional() }),
  ])
  .transform((value) =>
    typeof value === "number" ? value : (value.unread_count ?? value.count ?? value.unread ?? 0),
  );

export type AppNotification = z.output<typeof notificationSchema>;
