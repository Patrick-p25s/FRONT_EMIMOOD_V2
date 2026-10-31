// Messagerie de l'espace enseignant.
import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  MessagingNavProvider,
  type MessagingNav,
} from "@/features/messaging/components/MessagingNav";
import { MessagesPage } from "@/features/messaging/pages/MessagesPage";

export function TeacherMessagesPage({ conversationId }: { conversationId?: string | undefined }) {
  const navigate = useNavigate();
  const nav = useMemo<MessagingNav>(
    () => ({
      link: (id, { children, ...rest }) => (
        <Link to="/enseignant/messages/$conversationId" params={{ conversationId: id }} {...rest}>
          {children}
        </Link>
      ),
      profile: (id, { children, ...rest }) => (
        <Link to="/membres/$userId" params={{ userId: id }} {...rest}>
          {children}
        </Link>
      ),
      open: (id) =>
        void navigate({
          to: "/enseignant/messages/$conversationId",
          params: { conversationId: id },
        }),
      close: () => void navigate({ to: "/enseignant/messages" }),
    }),
    [navigate],
  );
  return (
    <MessagingNavProvider value={nav}>
      <MessagesPage conversationId={conversationId} />
    </MessagingNavProvider>
  );
}
