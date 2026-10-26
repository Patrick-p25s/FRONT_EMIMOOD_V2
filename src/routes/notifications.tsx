import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/components/emimood/data";
import { NotificationsPage } from "@/features/notification/pages/NotificationsPage";
export const Route = createFileRoute("/notifications")({
  head: () => pageHead("Notifications", "Les nouveautés de vos cours et de votre communauté EMIT."),
  component: NotificationsPage,
});
