// pages/study/FinishScreen.tsx
import { Link } from "@tanstack/react-router";
import { PartyPopper } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinishScreen({
  subjectName,
  subjectCompleted,
}: {
  subjectName: string;
  subjectCompleted: boolean;
}) {
  return (
    <article className="item-card text-center">
      <PartyPopper className="mx-auto size-10 text-primary" aria-hidden />
      <h2>{subjectCompleted ? "Félicitations !" : "Dernier chapitre atteint"}</h2>
      <p>
        {subjectCompleted
          ? `Vous avez terminé tous les chapitres de « ${subjectName} ».`
          : `Il vous reste des chapitres non terminés dans « ${subjectName} » : vous pouvez y revenir à tout moment.`}
      </p>
      <Link to="/subjects" className={cn(buttonVariants(), "mx-auto mt-4 w-fit no-underline")}>
        Retour aux matières
      </Link>
    </article>
  );
}
