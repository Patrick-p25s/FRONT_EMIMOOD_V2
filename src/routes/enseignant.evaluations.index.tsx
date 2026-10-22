// src/routes/enseignant.evaluations.index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { EvaluationsPage } from "@/features/enseignant/pages/overview";

export const Route = createFileRoute("/enseignant/evaluations/")({ component: EvaluationsPage });
