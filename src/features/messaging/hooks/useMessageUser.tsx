// features/messaging/hooks/useMessageUser.ts
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useMessagingMutations } from "./useMessagingMutations";

export function useMessageUser() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { startPrivate } = useMessagingMutations();

  const open = async (userId: string) => {
    try {
      const conversation = await startPrivate.mutateAsync(userId);
      if (user?.role === "teacher")
        void navigate({
          to: "/enseignant/messages/$conversationId",
          params: { conversationId: conversation.id },
        });
      else
        void navigate({
          to: "/messages/$conversationId",
          params: { conversationId: conversation.id },
        });
    } catch {
      // message déjà affiché par la mutation
    }
  };
  return {
    open,
    pending: startPrivate.isPending,
    allowed: Boolean(user) && user?.role !== "super_admin",
  };
}
