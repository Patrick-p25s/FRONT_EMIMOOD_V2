import { createFileRoute } from "@tanstack/react-router";
import { SuperAdministrationPage } from "@/components/emimood/pages";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/administration")({
  head: () =>
    pageHead(
      "Super administration",
      "Universités, structure, utilisateurs, rôles, codes d’invitation et journal d’EMIMood.",
    ),
  component: SuperAdministrationPage,
});
