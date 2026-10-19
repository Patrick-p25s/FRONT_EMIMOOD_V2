import { createFileRoute } from "@tanstack/react-router";
import { CoursesPage } from "@/components/emimood/pages";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/cours")({
  head: () => pageHead("Mes cours", "Les cours et chapitres de votre semestre à l’EMIT."),
  component: CoursesPage,
});
