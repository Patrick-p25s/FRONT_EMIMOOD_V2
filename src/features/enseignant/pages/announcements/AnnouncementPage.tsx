// features/enseignant/pages/announcements/AnnouncementsPage.tsx
import { PublicationsPage } from "@/features/enseignant/components/PublicationPage";
import { useMySubjects } from "../../hooks/useMySubjects";

export function AnnouncementsPage() {
  const entries = useMySubjects().data ?? [];
  // Les classes où vous enseignez : seules cibles possibles d'une publication « classe ».
  const classes = [
    ...new Map(
      entries
        .flatMap((entry) => entry.classes)
        .map((a) => [a.classe_id, { id: a.classe_id, name: a.classe_name }] as const),
    ).values(),
  ];
  const subjects = entries.map((entry) => ({ id: entry.subject.id, name: entry.subject.name }));
  return <PublicationsPage classes={classes} subjects={subjects} />;
}
