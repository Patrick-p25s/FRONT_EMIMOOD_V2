import { createFileRoute } from "@tanstack/react-router";
import { EvaluationsPage } from "@/components/emimood/pages";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/evaluations")({
  head: () =>
    pageHead("Évaluations", "Évaluations à venir et résultats de votre parcours universitaire."),
  component: EvaluationsPage,
});
