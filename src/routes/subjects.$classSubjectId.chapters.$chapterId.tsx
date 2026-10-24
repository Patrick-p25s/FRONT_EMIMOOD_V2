import { StudyPage } from "@/features/etudiant/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/subjects/$classSubjectId/chapters/$chapterId")({
  component: ChapterRoute,
});

function ChapterRoute() {
  const { classSubjectId, chapterId } = Route.useParams();
  return <StudyPage classSubjectId={classSubjectId} chapterId={chapterId} />;
}
