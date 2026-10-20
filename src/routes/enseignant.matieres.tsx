import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";

export const Route = createFileRoute("/enseignant/matieres")({
  component: () => <PageHeader title="Mes matières" description="Écran en construction." />,
});
