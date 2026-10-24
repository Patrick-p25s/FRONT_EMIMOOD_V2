// features/messaging/hooks/useMessaging.ts
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { messagingApi } from "../api/messaging";
import { msgKeys } from "../keys";
import { retryPolicy } from "@/lib/api/message";

export const useUnreadCount = () =>
  useQuery({
    queryKey: msgKeys.unread,
    queryFn: messagingApi.unread,
    refetchInterval: 120_000,
    retry: retryPolicy,
  });

export const useConversations = () =>
  useQuery({ queryKey: msgKeys.conversations, queryFn: messagingApi.list, retry: retryPolicy });

export const useConversation = (id: string) =>
  useQuery({
    queryKey: msgKeys.conversation(id),
    queryFn: () => messagingApi.get(id),
    retry: retryPolicy,
  });

/** Le temps réel tient le fil à jour : pas de rechargement automatique des pages. */
export const useMessages = (conversationId: string) =>
  useInfiniteQuery({
    queryKey: msgKeys.messages(conversationId),
    queryFn: ({ pageParam }) => messagingApi.messages(conversationId, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.has_more ? last.items[0]?.id : undefined),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: retryPolicy,
  });

export function useDebounced<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export const usePeopleSearch = (query: string) => {
  const clean = query.trim();
  return useQuery({
    queryKey: msgKeys.people(clean),
    queryFn: () => messagingApi.searchPeople(clean),
    enabled: clean.length >= 2,
    staleTime: 60_000,
    retry: retryPolicy,
  });
};
