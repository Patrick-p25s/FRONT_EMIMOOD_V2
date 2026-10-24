import { createFileRoute } from "@tanstack/react-router";
import { StudentMessagesPage } from "@/features/etudiant/pages/messages/StudentMessagesPage";

export const Route = createFileRoute("/messages/$conversationId")({ component: ThreadRoute });

function ThreadRoute() {
  const { conversationId } = Route.useParams();
  return <StudentMessagesPage conversationId={conversationId} />;
}
