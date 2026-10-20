import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";

export const Route = createFileRoute("/enseignant/evaluations")({
  component: () => <PageHeader title="Évaluations" description="Écran en construction." />,
});
