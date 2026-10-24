// features/etudiant/pages/messages/StudentMessagesPage.tsx : donne ses routes à la messagerie
import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  MessagingNavProvider,
  type MessagingNav,
} from "@/features/messaging/components/MessagingNav";
import { MessagesPage } from "@/features/messaging/pages/MessagesPage";

export function StudentMessagesPage({ conversationId }: { conversationId?: string | undefined }) {
  const navigate = useNavigate();
  const nav = useMemo<MessagingNav>(
    () => ({
      link: (id, { children, ...rest }) => (
        <Link to="/messages/$conversationId" params={{ conversationId: id }} {...rest}>
          {children}
        </Link>
      ),
      profile: (id, { children, ...rest }) => (
        <Link to="/membres/$userId" params={{ userId: id }} {...rest}>
          {children}
        </Link>
      ),
      open: (id) =>
        void navigate({ to: "/messages/$conversationId", params: { conversationId: id } }),
      close: () => void navigate({ to: "/messages" }),
    }),
    [navigate],
  );
  return (
    <MessagingNavProvider value={nav}>
      <MessagesPage conversationId={conversationId} />
    </MessagingNavProvider>
  );
}
