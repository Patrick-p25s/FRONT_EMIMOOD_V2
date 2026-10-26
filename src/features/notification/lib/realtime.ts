// features/notifications/lib/realtime.ts
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { RealtimeEvent } from "@/lib/realtime/socket";
import { notificationSchema } from "../api/schemas";
import { notifKeys } from "../keys";

export function handleNotificationEvent(client: QueryClient, event: RealtimeEvent): void {
  if (event.type === "connected") return void client.invalidateQueries({ queryKey: notifKeys.all });
  if (event.type !== "notification.created") return;
  void client.invalidateQueries({ queryKey: notifKeys.all });
  const parsed = notificationSchema.safeParse(event.data);
  if (parsed.success)
    toast(parsed.data.title, parsed.data.text ? { description: parsed.data.text } : undefined);
}
