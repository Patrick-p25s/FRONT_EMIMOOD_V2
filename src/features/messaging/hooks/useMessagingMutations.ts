// features/messaging/hooks/useMessagingMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { messagingApi } from "../api/messaging";
import type { Message } from "../api/schemas";
import { msgKeys } from "../keys";
import { upsertMessage } from "../lib/cache";
import { messageOf } from "@/lib/api/message";

export function useMessagingMutations() {
  const client = useQueryClient();
  const refreshLists = () =>
    Promise.all([
      client.invalidateQueries({ queryKey: msgKeys.conversations }),
      client.invalidateQueries({ queryKey: msgKeys.unread }),
    ]);
  const onError = (error: unknown) => toast.error(messageOf(error));
  const refreshConversation = (id: string) =>
    Promise.all([refreshLists(), client.invalidateQueries({ queryKey: msgKeys.conversation(id) })]);

  const send = useMutation({
    mutationFn: (v: { conversationId: string; content: string; replyToId?: string | undefined }) =>
      messagingApi.send(v.conversationId, v.content, v.replyToId),
    onSuccess: async (message) => {
      upsertMessage(client, message, true); // le socket livrera le même message : le doublon est ignoré
      await client.invalidateQueries({ queryKey: msgKeys.conversations });
    },
    onError,
  });

  const edit = useMutation({
    mutationFn: (v: { messageId: string; content: string }) =>
      messagingApi.edit(v.messageId, v.content),
    onSuccess: (message) => upsertMessage(client, message, false),
    onError,
  });

  const remove = useMutation({
    mutationFn: async (message: Message) => {
      await messagingApi.remove(message.id);
      return message;
    },
    onSuccess: async (message) => {
      upsertMessage(client, { ...message, deleted: true, content: null }, false);
      await refreshLists();
    },
    onError,
  });

  const markRead = useMutation({
    mutationFn: (conversationId: string) => messagingApi.markRead(conversationId),
    onSuccess: refreshLists,
  });

  const startPrivate = useMutation({
    mutationFn: (userId: string) => messagingApi.startPrivate(userId),
    onSuccess: refreshLists,
    onError,
  });
  const createGroup = useMutation({
    mutationFn: (v: { name: string; memberIds: string[] }) =>
      messagingApi.createGroup(v.name, v.memberIds),
    onSuccess: refreshLists,
    onError,
  });
  const rename = useMutation({
    mutationFn: (v: { conversationId: string; name: string }) =>
      messagingApi.rename(v.conversationId, v.name),
    onSuccess: (_d, v) => refreshConversation(v.conversationId),
    onError,
  });
  const addMembers = useMutation({
    mutationFn: (v: { conversationId: string; userIds: string[] }) =>
      messagingApi.addMembers(v.conversationId, v.userIds),
    onSuccess: (_d, v) => refreshConversation(v.conversationId),
    onError,
  });
  const removeMember = useMutation({
    mutationFn: (v: { conversationId: string; userId: string }) =>
      messagingApi.removeMember(v.conversationId, v.userId),
    onSuccess: (_d, v) => refreshConversation(v.conversationId),
    onError,
  });

  return {
    send,
    edit,
    remove,
    markRead,
    startPrivate,
    createGroup,
    rename,
    addMembers,
    removeMember,
  };
}
