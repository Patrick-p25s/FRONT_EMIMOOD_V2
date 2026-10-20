import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/features/admin/components/ComingSoon";
import { AcademicYearPage } from "@/features/admin/pages/academic-year";

export const Route = createFileRoute("/admin/academic-years")({
  component: AcademicYearPage,
});
