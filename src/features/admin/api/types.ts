// À SUPPRIMER : Mention, Level

import { Role } from "@/lib/auth";
import { Statut } from "@/lib/domain";

export type University = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  logo_url: string | null;
  statut: Statut;
  desactivate_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AcademicYear = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
};

export type Classe = {
  id: string;
  university_id: string;
  academic_year_id: string;
  mention: string; // texte libre, plus un identifiant
  level: string; // texte libre, plus un identifiant
  name: string;
  code: string;
  description: string | null;
  statut: Statut;
  desactivate_at: string | null;
  created_at: string;
  updated_at: string;
};

/** Réponse de création et de régénération : le seul moment où le code est renvoyé. */
export type ClasseWithCode = Classe & { code_invitation: string };

export type AdminUser = {
  id: string;
  university_id: string | null;
  classe_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
  statut: Statut;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};
export type InvitationCode = {
  id: string;
  university_id: string;
  code: string;
  role: "teacher" | "moderator";
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
};
export type Subject = {
  id: string;
  university_id: string;
  name: string;
  code: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};
export type ClassSubject = {
  id: string;
  classe_id: string;
  subject_id: string;
  semester: number | null;
  subject: Subject;
};
export type TeacherAssignment = { id: string; teacher_id: string; class_subject_id: string };
