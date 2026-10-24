// features/messaging/lib/typing.ts : qui est en train d'écrire (4 secondes d'effet)
import { useEffect, useState } from "react";

const TTL = 4000;
const typing = new Map<string, Map<string, number>>();
const subscribers = new Set<() => void>();

export function markTyping(conversationId: string, userId: string): void {
  const inConversation = typing.get(conversationId) ?? new Map<string, number>();
  inConversation.set(userId, Date.now() + TTL);
  typing.set(conversationId, inConversation);
  subscribers.forEach((notify) => notify());
}

export function useTypingUserIds(conversationId: string): string[] {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => {
    const compute = () => {
      const now = Date.now();
      const active = [...(typing.get(conversationId)?.entries() ?? [])]
        .filter(([, until]) => until > now)
        .map(([userId]) => userId);
      setIds((previous) =>
        previous.length === active.length &&
        previous.every((value, index) => value === active[index])
          ? previous
          : active,
      );
    };
    compute();
    subscribers.add(compute);
    const timer = setInterval(compute, 1000);
    return () => {
      subscribers.delete(compute);
      clearInterval(timer);
    };
  }, [conversationId]);
  return ids;
}
