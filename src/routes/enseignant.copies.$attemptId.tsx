import { createFileRoute } from "@tanstack/react-router";
import { GradingPage } from "@/features/enseignant/pages/grading/GradingPage";

export const Route = createFileRoute("/enseignant/copies/$attemptId")({ component: GradingRoute });

function GradingRoute() {
  const { attemptId } = Route.useParams();
  return <GradingPage attemptId={attemptId} />;
}
