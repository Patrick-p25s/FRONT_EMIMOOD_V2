// features/messaging/api/messaging.ts
import { api } from "@/lib/api/client";
import { parseRequest, parseResponse, safeId } from "@/lib/api/validate";
import {
  conversationDetailSchema,
  conversationsPageSchema,
  editSchema,
  groupSchema,
  membersSchema,
  messageSchema,
  messagesPageSchema,
  peopleSearchSchema,
  privateSchema,
  renameSchema,
  searchQuerySchema,
  sendSchema,
  unreadSchema,
} from "./schemas";

const conv = (id: string) => `/conversations/${safeId(id)}`;

export const messagingApi = {
  unread: async () =>
    parseResponse(unreadSchema, await api<unknown>("/conversations/unread-count")),
  list: async () =>
    parseResponse(
      conversationsPageSchema,
      await api<unknown>("/conversations", { query: { page: 1, page_size: 50 } }),
    ),
  get: async (id: string) => parseResponse(conversationDetailSchema, await api<unknown>(conv(id))),

  startPrivate: async (userId: string) =>
    parseResponse(
      conversationDetailSchema,
      await api<unknown>("/conversations/private", {
        method: "POST",
        body: parseRequest(privateSchema, { user_id: userId }),
      }),
    ),
  createGroup: async (name: string, memberIds: string[]) =>
    parseResponse(
      conversationDetailSchema,
      await api<unknown>("/conversations/groups", {
        method: "POST",
        body: parseRequest(groupSchema, { name, member_ids: memberIds }),
      }),
    ),
  rename: async (id: string, name: string) =>
    parseResponse(
      conversationDetailSchema,
      await api<unknown>(conv(id), { method: "PATCH", body: parseRequest(renameSchema, { name }) }),
    ),
  addMembers: async (id: string, userIds: string[]) =>
    parseResponse(
      conversationDetailSchema,
      await api<unknown>(`${conv(id)}/members`, {
        method: "POST",
        body: parseRequest(membersSchema, { user_ids: userIds }),
      }),
    ),
  removeMember: async (id: string, userId: string) => {
    await api<unknown>(`${conv(id)}/members/${safeId(userId)}`, { method: "DELETE" });
  },
  markRead: async (id: string) => {
    await api<unknown>(`${conv(id)}/read`, { method: "POST" });
  },

  messages: async (id: string, before?: string) =>
    parseResponse(
      messagesPageSchema,
      await api<unknown>(`${conv(id)}/messages`, {
        query: { limit: 30, before: before ? safeId(before) : undefined },
      }),
    ),
  send: async (id: string, content: string, replyToId?: string | undefined) =>
    parseResponse(
      messageSchema,
      await api<unknown>(`${conv(id)}/messages`, {
        method: "POST",
        body: parseRequest(sendSchema, {
          content,
          ...(replyToId ? { reply_to_id: replyToId } : {}),
        }),
      }),
    ),
  edit: async (messageId: string, content: string) =>
    parseResponse(
      messageSchema,
      await api<unknown>(`/messages/${safeId(messageId)}`, {
        method: "PATCH",
        body: parseRequest(editSchema, { content }),
      }),
    ),
  remove: async (messageId: string) => {
    await api<unknown>(`/messages/${safeId(messageId)}`, { method: "DELETE" });
  },

  searchPeople: async (query: string) =>
    parseResponse(
      peopleSearchSchema,
      await api<unknown>("/search/people", {
        query: { q: parseRequest(searchQuerySchema, query) },
      }),
    ),
};
