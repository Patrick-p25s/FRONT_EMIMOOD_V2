import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { HomePage } from "@/features/etudiant/pages/home/HomePage";
export const Route = createFileRoute("/accueil")({
  head: () =>
    pageHead(
      "Mon fil",
      "Votre fil EMIT : cours, ressources, projets et vie universitaire à Fianarantsoa.",
    ),
  component: HomePage,
});
