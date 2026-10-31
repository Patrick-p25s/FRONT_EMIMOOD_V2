import { createFileRoute } from "@tanstack/react-router";
import { SubjectDetailPage } from "@/features/enseignant/pages/subject-detail";

export const Route = createFileRoute("/enseignant/matieres/$classSubjectId")({
  validateSearch: (search: Record<string, unknown>): { onglet?: "evaluations" } =>
    search["onglet"] === "evaluations" ? { onglet: "evaluations" } : {},
  component: DetailRoute,
});

function DetailRoute() {
  const { classSubjectId } = Route.useParams();
  const { onglet } = Route.useSearch();
  return (
    <SubjectDetailPage
      classSubjectId={classSubjectId}
      initialTab={onglet === "evaluations" ? "assessments" : "courses"}
    />
  );
}
