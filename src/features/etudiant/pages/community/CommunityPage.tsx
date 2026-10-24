// features/etudiant/pages/community/CommunityPage.tsx : la page « Publications »
import { Heading } from "@/components/emimood/molecules/Heading";
import { useCampusTargets } from "../../hooks/useCampusTargets";
import { CampusFeed } from "@/features/enseignant/components/CampusFeed";

export function CommunityPage() {
  const { classes, subjects } = useCampusTargets();
  return (
    <div className="page">
      <Heading title="Communauté" subtitle="Partagez vos projets, vos ressources et vos idées." />
      <CampusFeed classes={classes} subjects={subjects} />
    </div>
  );
}
