// src/routes/admin.tsx
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { NotFoundView } from "@/components/emimood/molecules/NotFoundView";
import { AdminLayout } from "@/features/admin/layout/AdminLayout";
import { validateAdminSearch } from "@/features/admin/lib/search";
import { canAccess, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Administration — EMIMood" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  validateSearch: validateAdminSearch,
  component: AdminRoute,
});

function AdminRoute() {
  const { user } = useAuth();
  // __root attend déjà la session. Ici seul le super admin entre ; les autres voient
  // « introuvable », pour ne pas révéler que cet espace existe.
  if (!user || !canAccess(user.role, "/admin")) return <NotFoundView />;
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
