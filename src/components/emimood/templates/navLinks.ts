import { Bell, BookOpen, BriefcaseBusiness, ClipboardCheck, Files, Home, MessageSquare, MessagesSquare, PlayCircle } from "lucide-react";

export const links = [
  { to: "/accueil", label: "Accueil", icon: Home },
  { to: "/cours", label: "Mes cours", icon: BookOpen },
  { to: "/ressources", label: "Ressources", icon: Files },
  { to: "/videos", label: "Vidéos", icon: PlayCircle },
  { to: "/publications", label: "Publications", icon: MessagesSquare },
  { to: "/evaluations", label: "Évaluations", icon: ClipboardCheck },
  { to: "/opportunites", label: "Opportunités", icon: BriefcaseBusiness },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/notifications", label: "Notifications", icon: Bell },
] as const;
