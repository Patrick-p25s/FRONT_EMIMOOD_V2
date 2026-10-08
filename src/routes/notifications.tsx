import { createFileRoute } from "@tanstack/react-router";
import { NotificationsPage } from "@/components/emimood/pages";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/notifications")({
  head: () => pageHead("Notifications", "Les nouveautés de vos cours et de votre communauté EMIT."),
  component: NotificationsPage,
});
