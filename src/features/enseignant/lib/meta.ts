// lib/meta.ts
import {
  BookOpen,
  Briefcase,
  CalendarDays,
  FolderKanban,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/components/emimood/atoms/tones";
import type { AuthorRole, PublicationType } from "../api/types";

export const PUB_TYPES: Record<PublicationType, { label: string; icon: LucideIcon; tone: Tone }> = {
  announcement: { label: "Annonce", icon: Megaphone, tone: "info" },
  event: { label: "Événement", icon: CalendarDays, tone: "warning" },
  project: { label: "Projet", icon: FolderKanban, tone: "success" },
  experience: { label: "Expérience", icon: Briefcase, tone: "muted" },
  resource: { label: "Ressource", icon: BookOpen, tone: "info" },
};

export const ROLE_LABEL: Record<AuthorRole, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  moderator: "Modérateur",
  super_admin: "Administration",
};
