// components/MessageBubble.tsx : une bulle (répondre, modifier, supprimer)
import { useState } from "react";
import { CornerUpLeft, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Message } from "../api/schemas";
import { useMessagingMutations } from "../hooks/useMessagingMutations";
import { canEdit, clockTime } from "../lib/format";

type MessageBubbleProps = {
  message: Message;
  showSender: boolean;
  canModerate: boolean;
  onReply: (message: Message) => void;
};

export function MessageBubble({ message, showSender, canModerate, onReply }: MessageBubbleProps) {
  const { edit, remove } = useMessagingMutations();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content ?? "");
  const [confirming, setConfirming] = useState(false);

  const editable = canEdit(message);
  const deletable = !message.deleted && (message.is_mine || canModerate);
  const reply = message.reply_to;

  const save = async () => {
    const content = draft.trim();
    if (!content || content === message.content) return setEditing(false);
    try {
      await edit.mutateAsync({ messageId: message.id, content });
      setEditing(false);
    } catch {
      // message déjà affiché par la mutation (par exemple : 15 minutes dépassées)
    }
  };

  return (
    <div className={cn("group flex flex-col", message.is_mine ? "items-end" : "items-start")}>
      <div className={cn("bubble", message.is_mine && "self")}>
        {showSender && <p className="small font-semibold">{message.sender.name}</p>}

        {reply && (
          <div className="mb-1 rounded border-l-2 border-primary/60 bg-black/10 px-2 py-1 text-xs">
            <strong>{reply.sender_name}</strong>
            <p className="line-clamp-2">{reply.deleted ? "Message supprimé" : reply.content}</p>
          </div>
        )}

        {message.deleted ? (
          <p className="italic opacity-70">Message supprimé</p>
        ) : editing ? (
          <div className="grid gap-2">
            <Textarea
              aria-label="Modifier le message"
              rows={3}
              maxLength={4000}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                Annuler
              </Button>
              <Button size="sm" disabled={edit.isPending} onClick={() => void save()}>
                Enregistrer
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
        )}

        <p className="small mt-1">
          {clockTime(message.created_at)}
          {message.edited_at && !message.deleted ? " · modifié" : ""}
        </p>
      </div>

      {!message.deleted && !editing && (
        <div className="mt-0.5 flex gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label="Répondre"
            onClick={() => onReply(message)}
          >
            <CornerUpLeft className="size-3.5" aria-hidden />
          </Button>
          {editable && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Modifier"
              onClick={() => {
                setDraft(message.content ?? "");
                setEditing(true);
              }}
            >
              <Pencil className="size-3.5" aria-hidden />
            </Button>
          )}
          {deletable && (
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Supprimer"
              onClick={() => setConfirming(true)}
            >
              <Trash2 className="size-3.5" aria-hidden />
            </Button>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Supprimer ce message ?"
        description="Il sera effacé définitivement, pour tout le monde."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          try {
            await remove.mutateAsync(message);
            setConfirming(false);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </div>
  );
}
