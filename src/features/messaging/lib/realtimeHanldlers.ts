// features/messaging/lib/realtimeHandlers.ts : ce que chaque événement du serveur fait au cache
import type { QueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { RealtimeEvent } from "@/lib/realtime/socket";
import { messageSchema } from "../api/schemas";
import { msgKeys } from "../keys";
import { upsertMessage } from "./cache";
import { markTyping } from "./typing";

const conversationRef = z.object({ conversation_id: z.string().uuid() });
const typingRef = conversationRef.extend({ user_id: z.string().uuid() });

export function handleRealtimeEvent(client: QueryClient, event: RealtimeEvent): void {
  const refreshLists = () => {
    void client.invalidateQueries({ queryKey: msgKeys.conversations });
    void client.invalidateQueries({ queryKey: msgKeys.unread });
  };

  switch (event.type) {
    case "connected": // (re)connexion : on se resynchronise depuis l'API
      void client.invalidateQueries({ queryKey: msgKeys.all });
      return;
    case "message.created":
    case "message.updated":
    case "message.deleted": {
      const parsed = messageSchema.safeParse(event.data);
      if (!parsed.success) return;
      upsertMessage(client, parsed.data, event.type === "message.created");
      refreshLists();
      return;
    }
    case "conversation.updated":
    case "conversation.read": {
      const ref = conversationRef.safeParse(event.data);
      if (ref.success)
        void client.invalidateQueries({ queryKey: msgKeys.conversation(ref.data.conversation_id) });
      refreshLists();
      return;
    }
    case "conversation.removed": {
      const ref = conversationRef.safeParse(event.data);
      if (ref.success) {
        client.removeQueries({ queryKey: msgKeys.conversation(ref.data.conversation_id) });
        client.removeQueries({ queryKey: msgKeys.messages(ref.data.conversation_id) });
      }
      refreshLists();
      return;
    }
    case "typing": {
      const ref = typingRef.safeParse(event.data);
      if (ref.success) markTyping(ref.data.conversation_id, ref.data.user_id);
      return;
    }
    default:
      return;
  }
}
