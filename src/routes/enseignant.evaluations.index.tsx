import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";
import { GradingPage } from "@/features/enseignant/pages/grading";

export const Route = createFileRoute("/enseignant/evaluations/")({
  component: GradingPage,
});
