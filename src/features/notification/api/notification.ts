// features/notifications/api/notifications.ts
import { api } from "@/lib/api/client";
import { parseResponse, safeId } from "@/lib/api/validate";
import { notificationsListSchema, unreadCountSchema } from "./schemas";

export const PAGE_SIZE = 20;

export const notificationsApi = {
  list: async (page: number) =>
    parseResponse(
      notificationsListSchema,
      await api<unknown>("/notifications", { query: { page, page_size: PAGE_SIZE } }),
    ),
  unreadCount: async () =>
    parseResponse(unreadCountSchema, await api<unknown>("/notifications/unread-count")),
  markRead: async (id: string) => {
    await api<unknown>(`/notifications/${safeId(id)}/read`, { method: "POST" });
  },
  readAll: async () => {
    await api<unknown>("/notifications/read-all", { method: "POST" });
  },
  remove: async (id: string) => {
    await api<unknown>(`/notifications/${safeId(id)}`, { method: "DELETE" });
  },
};
