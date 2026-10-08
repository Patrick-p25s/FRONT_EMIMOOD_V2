import { createFileRoute } from "@tanstack/react-router";
import { PublicationsPage } from "@/components/emimood/pages";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/publications")({
  head: () => pageHead("Publications", "Projets, expériences et annonces de la communauté EMIT."),
  component: PublicationsPage,
});
