import { ResultPage } from "@/features/etudiant/pages/evaluations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/evaluations/result/$attemptId")({ component: ResultRoute });

function ResultRoute() {
  const { attemptId } = Route.useParams();
  return <ResultPage attemptId={attemptId} />;
}
