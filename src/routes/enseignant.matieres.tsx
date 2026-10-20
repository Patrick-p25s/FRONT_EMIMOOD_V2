// src/routes/enseignant.matieres.tsx
import { createFileRoute } from "@tanstack/react-router";
import { MySubjectsPage } from "@/features/enseignant/pages/subjects";

export const Route = createFileRoute("/enseignant/matieres")({ component: MySubjectsPage });
