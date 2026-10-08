import { createFileRoute } from "@tanstack/react-router";
import { RoleConsolePage, teacherConsole } from "@/components/emimood/admin";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/enseignant")({
  head: () => pageHead("Espace enseignant", "Gestion des classes, cours, ressources, évaluations et notes pour les enseignants de l’EMIT."),
  component: () => <RoleConsolePage config={teacherConsole} />,
});
