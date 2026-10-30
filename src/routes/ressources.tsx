import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/components/emimood/data";
import { StudentResourcesPage } from "@/features/etudiant/pages/StudentResourcesPage";
export const Route = createFileRoute("/ressources")({
  head: () =>
    pageHead("Ressources", "Documents officiels et ressources partagées par la communauté EMIT."),
  component: StudentResourcesPage,
});
