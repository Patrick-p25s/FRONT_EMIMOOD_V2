import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/emimood/atoms/Avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SubjectCardData } from "../api/schemas";
import { subjectIcon } from "../lib/subjectIcon";
import { initials } from "@/lib/format";
import { ProgressBar } from "../components/ProgressBar";

export function SubjectCard({ subject }: { subject: SubjectCardData }) {
  const Icon = subjectIcon(subject.name, subject.code);
  const empty = subject.chapters_count === 0;
  const [first, ...others] = subject.teachers;
  const percent = Math.round(subject.progress_percent);
  console.log(subject);
  return (
    <article className={cn("item-card", empty && "opacity-60")}>
      <div className="flex items-center justify-between">
        <span className="stat-icon">
          <Icon />
        </span>
        {subject.code && <span className="tag">{subject.code}</span>}
      </div>

      <h2>{subject.name}</h2>
      {subject.description && <p className="line-clamp-2">{subject.description}</p>}

      {first && (
        <div className="flex items-center gap-2">
          <Avatar initials={initials(first.name)} />
          <span className="small">
            Pr. {first.name}
            {others.length > 0 ? ` +${others.length}` : ""}
          </span>
        </div>
      )}

      {empty ? (
        <>
          <p className="small mt-3">Aucun cours publié pour le moment</p>
          <Button variant="outline" className="mt-5 w-full" disabled>
            Voir les chapitres <ArrowRight />
          </Button>
        </>
      ) : (
        <>
          <ProgressBar value={subject.progress_percent} label={`Progression en ${subject.name}`} />
          <div className="small flex justify-between">
            <span>
              {subject.chapters_count} chapitre{subject.chapters_count > 1 ? "s" : ""}
            </span>
            <span>{percent}% parcouru</span>
          </div>
          <Link
            to="/cours/$classSubjectId"
            params={{ classSubjectId: subject.class_subject_id }}
            className={cn(buttonVariants({ variant: "outline" }), "mt-5 w-full no-underline")}
          >
            Voir les chapitres <ArrowRight />
          </Link>
        </>
      )}
    </article>
  );
}
