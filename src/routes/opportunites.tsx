import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { OpportunitiesPage } from "@/components/emimood/organisms/OpportunitiesPage";
export const Route = createFileRoute("/opportunites")({
  head: () =>
    pageHead("Opportunités", "Stages, hackathons et opportunités pour la communauté EMIT."),
  component: OpportunitiesPage,
});
