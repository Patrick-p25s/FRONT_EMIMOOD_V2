import { createFileRoute } from "@tanstack/react-router";
import { EvaluationsPage } from "@/features/etudiant/pages/evaluations";

export const Route = createFileRoute("/evaluations/")({ component: EvaluationsPage });
