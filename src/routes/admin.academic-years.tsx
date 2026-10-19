import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/features/admin/components/ComingSoon";

export const Route = createFileRoute("/admin/academic-years")({
  component: () => <ComingSoon title="Années académiques" />,
});
