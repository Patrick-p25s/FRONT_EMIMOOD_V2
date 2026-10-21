import { createFileRoute } from "@tanstack/react-router";
import { AssessmentEditorPage } from "@/features/enseignant/pages/assessment-editor";

export const Route = createFileRoute("/enseignant/evaluations/$assessmentId")({ component: EditorRoute });

function EditorRoute() {
  const { assessmentId } = Route.useParams();
  return <AssessmentEditorPage assessmentId={assessmentId} />;
}
