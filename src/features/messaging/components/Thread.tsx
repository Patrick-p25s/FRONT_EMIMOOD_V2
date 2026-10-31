// components/Thread.tsx : le fil d'une conversation
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Info, Users } from "lucide-react";
import { roleLabel } from "@/features/profile/lib/labels";
import { EmptyState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import type { Message } from "../api/schemas";
import { useConversation, useMessages } from "../hooks/useMessaging";
import { useMessagingMutations } from "../hooks/useMessagingMutations";
import { flattenThread } from "../lib/cache";
import { buildRows } from "../lib/format";
import { useTypingUserIds } from "../lib/typing";
import { Composer } from "./Composer";
import { GroupInfoDialog } from "./GroupInfoDialog";
import { MessageBubble } from "./MessageBubble";
import { useMessagingNav } from "./MessagingNav";
import { isNotFound } from "@/lib/api/message";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import { useRealtimeStatus } from "@/lib/realtime/useRealtimeStatus";

export function Thread({ conversationId }: { conversationId: string }) {
  const { user } = useAuth();
  const nav = useMessagingNav();
  const detail = useConversation(conversationId);
  const thread = useMessages(conversationId);
  const { markRead } = useMessagingMutations();
  const status = useRealtimeStatus();
  const typingIds = useTypingUserIds(conversationId);

  const messages = useMemo(() => flattenThread(thread.data), [thread.data]);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const heightBefore = useRef<number | null>(null);

  const last = messages[messages.length - 1];
  const lastId = last?.id;
  const conversation = detail.data;
  const isGroup = conversation?.conversation_type === "group";
  const unread = conversation?.unread_count ?? 0;

  // Nouveau message : on reste collé en bas, sauf si l'on relit l'historique.
  useLayoutEffect(() => {
    const element = scroller.current;
    if (!element || !lastId) return;
    if (stickToBottom.current || last?.is_mine) {
      element.scrollTop = element.scrollHeight;
      setHasNew(false);
    } else {
      setHasNew(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastId]);

  // Messages plus anciens chargés : on garde la position de lecture.
  useLayoutEffect(() => {
    const element = scroller.current;
    if (element && heightBefore.current !== null) {
      element.scrollTop = element.scrollHeight - heightBefore.current;
      heightBefore.current = null;
    }
  }, [messages.length]);

  // Conversation ouverte et visible : elle est lue.
  useEffect(() => {
    if (!lastId || document.visibilityState !== "visible") return;
    if (last?.is_mine === false || unread > 0) markRead.mutate(conversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, lastId]);

  const loadOlder = async () => {
    if (scroller.current) heightBefore.current = scroller.current.scrollHeight;
    await thread.fetchNextPage();
  };

  const names = new Map(
    (conversation?.members ?? []).map((member) => [member.user.id, member.user.name] as const),
  );
  const typingNames = typingIds
    .filter((id) => id !== user?.id)
    .map((id) => names.get(id) ?? "Quelqu’un");
  const typingText =
    typingNames.length === 0
      ? ""
      : typingNames.length === 1
        ? `${typingNames[0]} écrit…`
        : "Plusieurs personnes écrivent…";

  if (detail.error) {
    return (
      <div className="grid h-full place-items-center p-6">
        <EmptyState
          title={
            isNotFound(detail.error) ? "Conversation introuvable" : "Conversation indisponible"
          }
          description="Elle n’existe pas ou vous n’en faites plus partie."
        />
      </div>
    );
  }

  const other = conversation?.other_user ?? null;

  return (
    <>
      <div className="chat-title flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Retour aux conversations"
          onClick={nav.close}
        >
          <ArrowLeft />
        </Button>
        {!conversation ? (
          <Skeleton className="h-10 w-48" />
        ) : (
          <>
            {isGroup || !other ? (
              <span
                className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"
                aria-hidden
              >
                <Users size={18} />
              </span>
            ) : (
              <UserAvatar name={other.name} url={other.avatar_url} />
            )}
            <div className="min-w-0 flex-1">
              {!isGroup && other ? (
                nav.profile(other.id, {
                  className: "font-bold text-foreground no-underline hover:underline",
                  children: conversation.name,
                })
              ) : (
                <strong>{conversation.name}</strong>
              )}
              <p className="small">
                {isGroup
                  ? `${conversation.members.length} membres`
                  : other
                    ? roleLabel(other.role)
                    : ""}
              </p>
            </div>
            {isGroup && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Infos du groupe"
                onClick={() => setInfoOpen(true)}
              >
                <Info />
              </Button>
            )}
          </>
        )}
      </div>

      <div
        className="chat-messages"
        ref={scroller}
        onScroll={(event) => {
          const element = event.currentTarget;
          stickToBottom.current =
            element.scrollHeight - element.scrollTop - element.clientHeight < 80;
          if (stickToBottom.current) setHasNew(false);
        }}
      >
        {thread.hasNextPage && (
          <Button
            variant="ghost"
            size="sm"
            className="mx-auto"
            disabled={thread.isFetchingNextPage}
            onClick={() => void loadOlder()}
          >
            {thread.isFetchingNextPage ? "Chargement…" : "Messages plus anciens"}
          </Button>
        )}

        {thread.isLoading ? (
          <Skeleton className="h-16 w-2/3" />
        ) : messages.length === 0 ? (
          <p className="small m-auto text-center">
            Aucun message pour le moment. Écrivez le premier.
          </p>
        ) : (
          buildRows(messages, isGroup).map((row) =>
            row.kind === "day" ? (
              <p key={row.key} className="small my-2 text-center capitalize">
                {row.label}
              </p>
            ) : (
              <MessageBubble
                key={row.key}
                message={row.message}
                showSender={row.showSender}
                canModerate={isGroup && conversation?.my_role === "admin"}
                onReply={setReplyTo}
              />
            ),
          )
        )}
      </div>

      {hasNew && (
        <div className="flex justify-center py-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
            }}
          >
            Nouveaux messages ↓
          </Button>
        </div>
      )}

      <p className="small h-5 px-3" aria-live="polite">
        {status === "reconnecting" ? "Reconnexion en cours…" : typingText}
      </p>

      <Composer
        conversationId={conversationId}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
      />

      {conversation && isGroup && (
        <GroupInfoDialog conversation={conversation} open={infoOpen} onOpenChange={setInfoOpen} />
      )}
    </>
  );
}
