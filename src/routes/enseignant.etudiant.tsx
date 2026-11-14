import { AnnouncementsPage } from "@/features/enseignant/pages/announcements/AnnouncementPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/enseignant/etudiant")({
  component: AnnouncementsPage,
});
