import { useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sendRealtime } from "@/lib/realtime/socket";
import type { Message } from "../api/schemas";
import { useMessagingMutations } from "../hooks/useMessagingMutations";

type ComposerProps = { conversationId: string; replyTo: Message | null; onClearReply: () => void };

export function Composer({ conversationId, replyTo, onClearReply }: ComposerProps) {
  const { send } = useMessagingMutations();
  const [text, setText] = useState("");
  const lastTyping = useRef(0);
  const field = useRef<HTMLTextAreaElement>(null);
  const content = text.trim();

  const submit = async () => {
    if (!content || send.isPending) return;
    try {
      await send.mutateAsync({ conversationId, content, replyToId: replyTo?.id });
      setText("");
      onClearReply();
      if (field.current) field.current.style.height = "auto";
    } catch {
      // message déjà affiché par la mutation : le texte reste dans le champ
    }
  };

  const change = (value: string, element: HTMLTextAreaElement) => {
    setText(value);
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, 120)}px`;
    const now = Date.now();
    if (value && now - lastTyping.current > 2000) {
      lastTyping.current = now;
      sendRealtime({ type: "typing", conversation_id: conversationId });
    }
  };

  return (
    <>
      {replyTo && (
        <div className="flex items-center gap-2 border-t px-3 py-1.5 text-xs">
          <span className="min-w-0 flex-1 truncate">
            Réponse à <strong>{replyTo.sender.name}</strong> : {replyTo.content}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            aria-label="Annuler la réponse"
            onClick={onClearReply}
          >
            <X className="size-3.5" aria-hidden />
          </Button>
        </div>
      )}
      <form
        className="chat-input"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <Textarea
          ref={field}
          rows={1}
          maxLength={4000}
          placeholder="Écrire un message…"
          aria-label="Message"
          className="min-h-10 resize-none"
          value={text}
          onChange={(event) => change(event.target.value, event.target)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              void submit();
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          aria-label="Envoyer le message"
          disabled={!content || send.isPending}
        >
          <Send />
        </Button>
      </form>
      {text.length > 3500 && <p className="small px-3 pb-1 text-right">{text.length} / 4000</p>}
    </>
  );
}
