// features/messaging/lib/cache.ts : le fil se met à jour sans recharger
import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { Message, MessagesPage } from "../api/schemas";
import { msgKeys } from "../keys";

type Thread = InfiniteData<MessagesPage, unknown>;

/** appendIfNew : vrai pour un message créé, faux pour une modification ou une suppression. */
export function upsertMessage(client: QueryClient, message: Message, appendIfNew: boolean): void {
  client.setQueryData<Thread>(msgKeys.messages(message.conversation_id), (old) => {
    if (!old) return old;
    const known = old.pages.some((page) => page.items.some((item) => item.id === message.id));
    if (known) {
      return {
        ...old,
        pages: old.pages.map((page) => ({
          ...page,
          items: page.items.map((item) => (item.id === message.id ? message : item)),
        })),
      };
    }
    if (!appendIfNew) return old;
    const [latest, ...older] = old.pages;
    return latest
      ? { ...old, pages: [{ ...latest, items: [...latest.items, message] }, ...older] }
      : old;
  });
}

/** Pages [récent, …, ancien] → liste chronologique sans doublon. */
export function flattenThread(data: Thread | undefined): Message[] {
  const seen = new Set<string>();
  return [...(data?.pages ?? [])]
    .reverse()
    .flatMap((page) => page.items)
    .filter((message) => (seen.has(message.id) ? false : (seen.add(message.id), true)));
}
