// features/messaging/keys.ts
export const msgKeys = {
  all: ["messaging"] as const,
  unread: ["messaging", "unread"] as const,
  conversations: ["messaging", "conversations"] as const,
  conversation: (id: string) => ["messaging", "conversation", id] as const,
  messages: (id: string) => ["messaging", "messages", id] as const,
  people: (query: string) => ["messaging", "people", query] as const,
};
