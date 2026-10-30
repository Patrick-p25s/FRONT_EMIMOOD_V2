// src/routes/admin.students.tsx (adaptez le préfixe et la validation de recherche à vos autres routes admin)
import { UsersPage } from "@/features/admin/pages/user/UserPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/users")({
  component: () => (
    <UsersPage
      role="student"
      title="Étudiants"
      description="Consultez et gérez les comptes étudiants."
      singular="étudiant"
    />
  ),
});
