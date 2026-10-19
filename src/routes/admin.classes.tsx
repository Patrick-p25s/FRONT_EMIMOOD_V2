import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/features/admin/components/ComingSoon";

export const Route = createFileRoute("/admin/classes")({
  component: () => <ComingSoon title="Classes et codes" />,
});
