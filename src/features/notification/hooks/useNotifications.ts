// features/notifications/hooks/useNotifications.ts
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { notifKeys } from "../keys";
import { notificationsApi, PAGE_SIZE } from "../api/notification";
import { messageOf, retryPolicy } from "@/lib/api/message";

export const useNotificationUnread = () =>
  useQuery({
    queryKey: notifKeys.unread,
    queryFn: notificationsApi.unreadCount,
    refetchInterval: 120_000,
    retry: retryPolicy,
  });

export const useNotifications = () =>
  useInfiniteQuery({
    queryKey: notifKeys.list,
    queryFn: ({ pageParam }) => notificationsApi.list(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.length >= PAGE_SIZE ? all.length + 1 : undefined),
    retry: retryPolicy,
  });

export function useNotificationActions() {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: notifKeys.all });
  const onError = (error: unknown) => toast.error(messageOf(error));
  return {
    markRead: useMutation({ mutationFn: notificationsApi.markRead, onSuccess: refresh, onError }),
    readAll: useMutation({ mutationFn: notificationsApi.readAll, onSuccess: refresh, onError }),
    remove: useMutation({ mutationFn: notificationsApi.remove, onSuccess: refresh, onError }),
  };
}
