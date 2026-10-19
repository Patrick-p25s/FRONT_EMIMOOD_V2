import { createFileRoute } from "@tanstack/react-router";
import { OpportunitiesPage } from "@/components/emimood/pages";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/opportunites")({
  head: () =>
    pageHead("Opportunités", "Stages, hackathons et opportunités pour la communauté EMIT."),
  component: OpportunitiesPage,
});
