import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { SettingsPage } from "@/components/emimood/organisms/SettingsPage";
export const Route = createFileRoute("/parametres")({
  head: () =>
    pageHead("Paramètres", "Personnalisez votre thème clair, sombre ou système sur EMIMood."),
  component: SettingsPage,
});
