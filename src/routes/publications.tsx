import { createFileRoute } from "@tanstack/react-router";

import { pageHead } from "@/components/emimood/data";
import { PublicationsPage } from "@/features/publication/PublicationsPage";
export const Route = createFileRoute("/publications")({
  head: () => pageHead("Publications", "Projets, expériences et annonces de la communauté EMIT."),
  component: PublicationsPage,
});
