// features/profile/lib/labels.ts
const ROLES: Record<string, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  moderator: "Modérateur",
  super_admin: "Administration",
};
export const roleLabel = (role: string) => ROLES[role] ?? role;

export const memberSince = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
