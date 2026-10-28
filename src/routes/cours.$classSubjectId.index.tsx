import { StudyPage } from "@/features/etudiant/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cours/$classSubjectId/")({ component: StudyRoute });

function StudyRoute() {
  const { classSubjectId } = Route.useParams();
  return <StudyPage classSubjectId={classSubjectId} />;
}
