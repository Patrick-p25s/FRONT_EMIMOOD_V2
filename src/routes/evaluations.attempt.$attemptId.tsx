import { AttemptPage } from "@/features/etudiant/pages/evaluations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/evaluations/attempt/$attemptId")({
  component: AttemptRoute,
});

function AttemptRoute() {
  const { attemptId } = Route.useParams();
  return <AttemptPage attemptId={attemptId} />;
}
