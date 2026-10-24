// components/StartChatButton.tsx : « Envoyer un message » depuis un profil
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMessagingMutations } from "../hooks/useMessagingMutations";

export function StartChatButton({
  userId,
  onOpen,
}: {
  userId: string;
  onOpen: (conversationId: string) => void;
}) {
  const { startPrivate } = useMessagingMutations();
  return (
    <Button
      disabled={startPrivate.isPending}
      onClick={async () => {
        try {
          onOpen((await startPrivate.mutateAsync(userId)).id);
        } catch {
          // message déjà affiché par la mutation
        }
      }}
    >
      <MessageCircle /> Envoyer un message
    </Button>
  );
}
