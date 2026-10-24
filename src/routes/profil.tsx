import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/components/emimood/data";
import { ProfilePage } from "@/features/profile/componets/pages/ProfilePage";
export const Route = createFileRoute("/profil")({
  head: () => pageHead("Mon profil", "Votre profil académique, compétences et communauté EMIT."),
  component: ProfilePage,
});
