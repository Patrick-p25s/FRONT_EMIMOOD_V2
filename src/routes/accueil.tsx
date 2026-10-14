import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/emimood/pages";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/accueil")({
  head: () =>
    pageHead("Mon fil", "Votre fil EMIT : cours, ressources, projets et vie universitaire à Fianarantsoa."),
  component: HomePage,
});
