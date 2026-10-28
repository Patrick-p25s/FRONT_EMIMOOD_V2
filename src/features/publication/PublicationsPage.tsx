// features/etudiant/pages/publications/PublicationsPage.tsx
import { Heading } from "@/components/emimood/molecules/Heading";
import { useCampusTargets } from "../etudiant/hooks/useCampusTargets";
import { CampusFeed } from "./components/CampusFeed";

export function PublicationsPage() {
  const { classes, subjects } = useCampusTargets();
  return (
    <div className="page">
      <Heading
        title="Publications"
        subtitle="Les idées, projets et expériences qui font vivre notre campus."
      />
      <div className="max-w-3xl">
        <CampusFeed classes={classes} subjects={subjects} />
      </div>
    </div>
  );
}
