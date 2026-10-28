// components/ConversationList.tsx
import { MessageSquarePlus, Users } from "lucide-react";
import { ErrorState } from "@/components/emimood/molecules/states";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Conversation } from "../api/schemas";
import { useConversations } from "../hooks/useMessaging";
import { listTime } from "../lib/format";
import { useMessagingNav } from "./MessagingNav";
import { UserAvatar } from "@/features/profile/componets/UserAvatar";

function preview(conversation: Conversation): string {
  const last = conversation.last_message;
  if (!last) return "Nouvelle conversation";
  if (last.deleted) return "Message supprimé";
  return `${conversation.conversation_type === "group" ? `${last.sender_name} : ` : ""}${last.content ?? ""}`;
}

function ConversationItem({
  conversation,
  active,
}: {
  conversation: Conversation;
  active: boolean;
}) {
  const nav = useMessagingNav();
  const group = conversation.conversation_type === "group";
  return nav.link(conversation.id, {
    "aria-current": active ? "page" : undefined,
    className: cn(
      buttonVariants({ variant: active ? "secondary" : "ghost" }),
      "chat-person h-auto w-full justify-start gap-3 py-2 text-left no-underline",
    ),
    children: (
      <>
        {group || !conversation.other_user ? (
          <span
            className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
            aria-hidden
          >
            <Users size={18} />
          </span>
        ) : (
          <UserAvatar
            name={conversation.other_user.name}
            url={conversation.other_user.avatar_url}
          />
        )}
        <div className="min-w-0 flex-1">
          <strong className="block truncate">{conversation.name}</strong>
          <span className="block truncate text-xs text-muted-foreground">
            {preview(conversation)}
          </span>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[11px] text-muted-foreground">
            {listTime(conversation.last_activity_at)}
          </span>
          {conversation.unread_count > 0 && (
            <span
              className="grid min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground"
              aria-label={`${conversation.unread_count} non lus`}
            >
              {conversation.unread_count > 99 ? "99+" : conversation.unread_count}
            </span>
          )}
        </div>
      </>
    ),
  });
}

type ConversationListProps = {
  activeId?: string | undefined;
  onNewChat: () => void;
  onNewGroup: () => void;
};

export function ConversationList({ activeId, onNewChat, onNewGroup }: ConversationListProps) {
  const conversations = useConversations();
  const items = conversations.data?.items ?? [];

  return (
    <>
      <div className="chat-list-header">
        <div>
          <p className="chat-list-kicker">Boîte de réception</p>
          <p className="chat-list-count">
            {items.length} conversation{items.length > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="chat-list-actions">
        <Button size="sm" className="flex-1" onClick={onNewChat}>
          <MessageSquarePlus /> Nouveau
        </Button>
        <Button size="sm" variant="outline" className="flex-1" onClick={onNewGroup}>
          <Users /> Groupe
        </Button>
      </div>

      {conversations.error ? (
        <ErrorState error={conversations.error} onRetry={() => void conversations.refetch()} />
      ) : conversations.isLoading ? (
        <div className="chat-conversation-list grid gap-1.5">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-14 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="chat-empty-state small">
          Aucune conversation pour le moment. Démarrez-en une avec « Nouveau », ou ouvrez le profil
          d’un membre.
        </p>
      ) : (
        <div className="chat-conversation-list">
          {items.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              active={conversation.id === activeId}
            />
          ))}
        </div>
      )}
    </>
  );
}
