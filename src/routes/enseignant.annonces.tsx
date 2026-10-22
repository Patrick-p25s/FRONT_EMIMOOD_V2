// src/routes/enseignant.annonces.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementsPage } from "@/features/enseignant/pages/announcements/AnnouncementPage";

export const Route = createFileRoute("/enseignant/annonces")({ component: AnnouncementsPage });
