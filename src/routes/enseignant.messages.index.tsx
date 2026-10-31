import { TeacherMessagesPage } from "@/features/enseignant/pages/message/TeacherMessagesPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/enseignant/messages/")({
  component: () => <TeacherMessagesPage />,
});
