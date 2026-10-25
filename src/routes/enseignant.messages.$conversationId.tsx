import { TeacherMessagesPage } from "@/features/enseignant/pages/message/TeacheMessagesPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/enseignant/messages/$conversationId")({
  component: ThreadRoute,
});

function ThreadRoute() {
  const { conversationId } = Route.useParams();
  return <TeacherMessagesPage conversationId={conversationId} />;
}
