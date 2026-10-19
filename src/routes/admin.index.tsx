import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/features/admin/components/ComingSoon";
import { AdminPage } from "@/components/emimood/pages/AdminPage";

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
});
