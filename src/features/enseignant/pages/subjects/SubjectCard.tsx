// pages/subjects/SubjectCard.tsx
import { MoreHorizontal, NotebookText, X } from "lucide-react";
import { IconBox } from "@/components/emimood/atoms/IconBox";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MyAssignment, MySubject } from "../../api/types";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
export type SubjectActions = {
  onEdit: () => void;
  onAddClasses: () => void;
  onDelete: () => void;
  onRemoveClass: (assignment: MyAssignment) => void;
};

type SubjectCardProps = { item: MySubject; actions?: SubjectActions | undefined };

export function SubjectCard({ item, actions }: SubjectCardProps) {
  const { subject, classes } = item;
  return (
    <article className="flex min-h-42 flex-col gap-3 rounded-xl border bg-card p-5 shadow-(--shadow) transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-3">
        <IconBox icon={NotebookText} tone="success" />
        <div className="flex items-center gap-1">
          {subject.code && <StatusPill>{subject.code}</StatusPill>}
          {actions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={`Actions pour ${subject.name}`}
                >
                  <MoreHorizontal className="size-4" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={actions.onEdit}>Modifier</DropdownMenuItem>
                <DropdownMenuItem onSelect={actions.onAddClasses}>
                  Ajouter des classes
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={actions.onDelete}>Supprimer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      <div className="min-w-0">
        {classes.length === 1 && classes[0] ? (
          <Link
            to="/enseignant/matieres/$classSubjectId"
            params={{ classSubjectId: classes[0].class_subject_id }}
            className="block no-underline hover:text-primary cursor-pointers"
          >
            <h2 className="truncate text-base font-bold">{subject.name}</h2>
          </Link>
        ) : (
          <h2 className="truncate text-base font-bold">{subject.name}</h2>
        )}
        {subject.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{subject.description}</p>
        )}
      </div>

      <div className="mt-auto">
        {classes.length === 0 ? (
          <p className="text-xs text-muted-foreground">Aucune classe liée pour le moment.</p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {classes.map((assignment) => (
              <li
                key={assignment.id}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full bg-muted py-1 pl-2.5 text-xs transition-colors hover:bg-primary/10 hover:text-primary",
                  actions ? "pr-1" : "pr-2.5",
                )}
              >
                <Link
                  to="/enseignant/matieres/$classSubjectId"
                  params={{ classSubjectId: assignment.class_subject_id }}
                  className="no-underline cursor-pointer"
                >
                  {assignment.classe_name}
                  {assignment.semester !== null ? ` · S${assignment.semester}` : ""}
                </Link>
                {actions && (
                  <button
                    type="button"
                    aria-label={`Retirer ${assignment.classe_name}`}
                    className="grid size-5 place-items-center rounded-full hover:bg-background"
                    onClick={() => actions.onRemoveClass(assignment)}
                  >
                    <X className="size-3" aria-hidden />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
