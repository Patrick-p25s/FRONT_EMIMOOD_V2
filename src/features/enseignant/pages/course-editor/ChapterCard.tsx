// pages/course-editor/ChapterCard.tsx
import {
  ArrowDown,
  ArrowUp,
  FileText,
  Link2,
  Paperclip,
  Pencil,
  Plus,
  Trash2,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Chapter, CourseResource, ResourceType } from "../../api/types";
import { useResources } from "../../hooks/useCourses";

const ICONS: Record<ResourceType, LucideIcon> = {
  document: FileText,
  video: Video,
  link: Link2,
  other: Paperclip,
};

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

type ChapterCardProps = {
  chapter: Chapter;
  index: number;
  total: number;
  onMove: (direction: -1 | 1) => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddResource: () => void;
  onEditResource: (resource: CourseResource) => void;
  onDeleteResource: (resource: CourseResource) => void;
};

export function ChapterCard({
  chapter,
  index,
  total,
  onMove,
  onEdit,
  onDelete,
  onAddResource,
  onEditResource,
  onDeleteResource,
}: ChapterCardProps) {
  const resources = useResources(chapter.id);
  const list = resources.data ?? [];

  return (
    <li className="rounded-xl border bg-card p-4 shadow-[var(--shadow)]">
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

      <div className="mt-3 grid gap-1.5 pl-11">
        {resources.isLoading ? (
          <Skeleton className="h-8 w-full" />
        ) : (
          list.map((resource) => {
            const Icon = ICONS[resource.resource_type];
            return (
              <div
                key={resource.id}
                className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm"
              >
                <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-0 flex-1 truncate font-medium no-underline hover:underline"
                >
                  {resource.title}
                </a>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  {hostOf(resource.url)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label={`Modifier ${resource.title}`}
                  onClick={() => onEditResource(resource)}
                >
                  <Pencil className="size-3.5" aria-hidden />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  aria-label={`Supprimer ${resource.title}`}
                  onClick={() => onDeleteResource(resource)}
                >
                  <Trash2 className="size-3.5" aria-hidden />
                </Button>
              </div>
            );
          })
        )}
        <Button variant="ghost" size="sm" className="w-fit text-primary" onClick={onAddResource}>
          <Plus className="size-4" aria-hidden /> Ajouter une ressource
        </Button>
      </div>
    </li>
  );
}
