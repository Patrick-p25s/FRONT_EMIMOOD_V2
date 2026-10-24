import { createFileRoute } from "@tanstack/react-router";
import { StudentMessagesPage } from "@/features/etudiant/pages/messages/StudentMessagesPage";

export const Route = createFileRoute("/messages/")({ component: () => <StudentMessagesPage /> });
