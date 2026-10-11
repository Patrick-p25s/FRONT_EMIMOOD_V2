import { createFileRoute } from "@tanstack/react-router";
import { RoleConsolePage } from "@/components/emimood/templates";
import { teacherConsole } from "@/components/emimood/data";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/enseignant")({
  head: () => pageHead("Espace enseignant", "Gestion des classes, cours, ressources, évaluations et notes pour les enseignants de l’EMIT."),
  component: () => <RoleConsolePage config={teacherConsole} />,
});
