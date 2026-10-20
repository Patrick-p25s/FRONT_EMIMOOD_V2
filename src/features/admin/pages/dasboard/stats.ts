// stats.ts : ajouter une carte = ajouter une ligne
import {
  Ban,
  Building2,
  GraduationCap,
  KeyRound,
  Presentation,
  School,
  UserX,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Tone } from "@/components/emimood/atoms/tones";
import type { CountSpec } from "../../hooks/useDashboard";
import type { AdminPath } from "../../lib/search";

export type StatDef = CountSpec & {
  label: string;
  icon: LucideIcon;
  tone: Tone;
  to: AdminPath;
  filter?: { statut?: string; role?: string };
};

// Ordre = lecture en deux rangées de 4.
export const STATS: StatDef[] = [
  {
    key: "uni-active",
    resource: "universities",
    path: "/universities/",
    params: { statut: "active" },
    label: "Universités actives",
    icon: Building2,
    tone: "success",
    to: "/admin/universities",
    filter: { statut: "active" },
  },
  {
    key: "users",
    resource: "users",
    paging: "skip",
    path: "/users/",
    scoped: true,
    label: "Utilisateurs",
    icon: Users,
    tone: "info",
    to: "/admin/users",
  },
  {
    key: "students",
    resource: "users",
    paging: "skip",
    path: "/users/",
    params: { role: "student" },
    scoped: true,
    label: "Étudiants",
    icon: GraduationCap,
    tone: "success",
    to: "/admin/users",
    filter: { role: "student" },
  },
  {
    key: "teachers",
    resource: "users",
    paging: "skip",
    path: "/users/",
    params: { role: "teacher" },
    scoped: true,
    label: "Enseignants",
    icon: Presentation,
    tone: "info",
    to: "/admin/users",
    filter: { role: "teacher" },
  },
  {
    key: "classes",
    resource: "classes",
    path: "/classes/",
    params: { statut: "active" },
    scoped: true,
    label: "Classes actives",
    icon: School,
    tone: "success",
    to: "/admin/classes",
    filter: { statut: "active" },
  },
  {
    key: "codes",
    resource: "invitation-codes",
    paging: "skip",
    path: "/invitation-codes/",
    params: { active_only: "true" },
    scoped: true,
    label: "Codes d’invitation actifs",
    icon: KeyRound,
    tone: "muted",
    to: "/admin/classes",
  },
  {
    key: "uni-suspend",
    resource: "universities",
    path: "/universities/",
    params: { statut: "suspend" },
    label: "Universités suspendues",
    icon: Ban,
    tone: "warning",
    to: "/admin/universities",
    filter: { statut: "suspend" },
  },
  {
    key: "suspended",
    resource: "users",
    paging: "skip",
    path: "/users/",
    params: { statut: "suspend" },
    scoped: true,
    label: "Comptes suspendus",
    icon: UserX,
    tone: "warning",
    to: "/admin/users",
    filter: { statut: "suspend" },
  },
];
