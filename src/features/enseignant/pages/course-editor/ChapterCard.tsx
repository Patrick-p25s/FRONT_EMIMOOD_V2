import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Chapter } from "../../api/types";
import { ChapterSupportsPanel } from "@/features/resource/components/ChapterSupportsPanel";
import { useResources } from "../../hooks/useCourses";
import { Skeleton } from "@/components/ui/skeleton";

type ChapterCardProps = {
  chapter: Chapter;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function ChapterCard({ chapter, index, total, onMove, onEdit, onDelete }: ChapterCardProps) {
  const resources = useResources(chapter.id);
  const texts = chapter.content ?? []; // NOUVEAU

  return (
    <li className="rounded-xl border bg-card p-4 shadow-(--shadow)">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{chapter.title}</h3>
          {chapter.description && (
            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
              {chapter.description}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={index === 0}
            aria-label="Monter le chapitre"
            onClick={() => onMove(-1)}
          >
            <ArrowUp className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={index === total - 1}
            aria-label="Descendre le chapitre"
            onClick={() => onMove(1)}
          >
            <ArrowDown className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Modifier le chapitre"
            onClick={onEdit}
          >
            <Pencil className="size-4" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            aria-label="Supprimer le chapitre"
            onClick={onDelete}
          >
            <Trash2 className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      {/* NOUVEAU : le texte d'explication, affiché en simple texte (jamais en HTML) */}
      {texts.length > 0 && (
        <div className="mt-3 grid gap-2 pl-11 text-sm leading-relaxed">
          {texts.map((block) => (
            <p key={block.id} className="whitespace-pre-line">
              {block.content}
            </p>
          ))}
        </div>
      )}

      <div className="mt-3 grid gap-1.5 pl-11">
        {resources.isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          <ChapterSupportsPanel chapterId={chapter.id} />
        )}
      </div>
    </li>
  );
}
