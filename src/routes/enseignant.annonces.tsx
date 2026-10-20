import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";

export const Route = createFileRoute("/enseignant/annonces")({
  component: () => <PageHeader title="Annonces" description="Écran en construction." />,
});
