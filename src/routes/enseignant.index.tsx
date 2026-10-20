import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";

export const Route = createFileRoute("/enseignant/")({
  component: () => <PageHeader title="Accueil" description="Écran en construction." />,
});
