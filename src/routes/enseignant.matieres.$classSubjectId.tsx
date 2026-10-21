import { createFileRoute } from "@tanstack/react-router";
import { SubjectDetailPage } from "@/features/enseignant/pages/subject-detail";

export const Route = createFileRoute("/enseignant/matieres/$classSubjectId")({ component: DetailRoute });

function DetailRoute() {
  const { classSubjectId } = Route.useParams();
  return <SubjectDetailPage classSubjectId={classSubjectId} />;
}
