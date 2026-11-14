import { SubjectsPage } from "@/features/etudiant/pages";
import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cours/")({
  head: () => pageHead("Cours", "Suivez ici votre évolution"),
  component: SubjectsPage,
});
