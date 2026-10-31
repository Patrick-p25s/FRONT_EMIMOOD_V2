import { createFileRoute } from "@tanstack/react-router";
import { RoleConsolePage } from "@/components/emimood/templates";
import { delegateConsole } from "@/components/emimood/data";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/delegue")({
  head: () =>
    pageHead(
      "Espace délégué",
      "Modération des publications et annonces de classe pour les délégués de l’EMIT.",
    ),
  component: () => <RoleConsolePage config={delegateConsole} />,
});
