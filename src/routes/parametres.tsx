import { createFileRoute } from "@tanstack/react-router";
import { SettingsPage } from "@/components/emimood/pages";
import { pageHead } from "@/lib/seo";
export const Route = createFileRoute("/parametres")({
  head: () =>
    pageHead("Paramètres", "Personnalisez votre thème clair, sombre ou système sur EMIMood."),
  component: SettingsPage,
});
