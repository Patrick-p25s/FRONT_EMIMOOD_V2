import { SubjectsPage } from "@/features/etudiant/pages";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/subjects/")({ component: SubjectsPage });
