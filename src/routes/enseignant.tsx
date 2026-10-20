import { createFileRoute, Outlet } from "@tanstack/react-router";
import { TeacherLayout } from "@/features/enseignant/layout/TeacherLayout";
import { canAccess, useAuth } from "@/lib/auth";
import { NotFoundView } from "@/components/emimood/molecules";
// import { NotFoundView } from "…";   ← même ligne que dans routes/admin.tsx

export const Route = createFileRoute("/enseignant")({
  head: () => ({
    meta: [{ title: "Espace enseignant · EMIMood" }, { name: "robots", content: "noindex" }],
  }),
  component: TeacherRoute,
});

function TeacherRoute() {
  const { user } = useAuth();
  if (!user || !canAccess(user.role, "/enseignant")) return <NotFoundView />;
  return (
    <TeacherLayout>
      <Outlet />
    </TeacherLayout>
  );
}
