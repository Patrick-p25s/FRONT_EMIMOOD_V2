// pages/study/ChapterList.tsx : liste à gauche (ordinateur), menu déroulant (mobile)
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudyChapter } from "../api/schemas";

type ChapterListProps = {
  classSubjectId: string;
  chapters: StudyChapter[];
  activeId: string;
  onSelect: (chapterId: string) => void;
};

export function ChapterList({ classSubjectId, chapters, activeId, onSelect }: ChapterListProps) {
  const grouped = new Set(chapters.map((chapter) => chapter.course_id)).size > 1;

  return (
    <>
      <select
        className="h-10 w-full rounded-md border bg-background px-3 text-sm md:hidden"
        aria-label="Choisir un chapitre"
        value={activeId}
        onChange={(event) => onSelect(event.target.value)}
      >
        {chapters.map((chapter) => (
          <option key={chapter.id} value={chapter.id}>
            {chapter.completed ? "✓ " : ""}
            {chapter.number}. {chapter.title}
          </option>
        ))}
      </select>

      <aside className="document-list hidden h-fit md:block">
        {chapters.map((chapter, index) => (
          <div key={chapter.id}>
            {grouped && chapter.course_id !== chapters[index - 1]?.course_id && (
              <p className="small px-1 pb-1 pt-3 font-semibold">{chapter.course_title}</p>
            )}
            <Link
              to="/subjects/$classSubjectId/chapters/$chapterId"
              params={{ classSubjectId, chapterId: chapter.id }}
              aria-current={chapter.id === activeId ? "page" : undefined}
              className={cn(
                "document-row w-full text-left no-underline",
                chapter.id === activeId && "ring-2 ring-primary",
              )}
            >
              {chapter.completed ? (
                <CheckCircle2 size={18} className="shrink-0 text-success" aria-label="Terminé" />
              ) : (
                <span className="small w-[18px]">{chapter.number}</span>
              )}
              <span className="text-sm font-medium">{chapter.title}</span>
            </Link>
          </div>
        ))}
      </aside>
    </>
  );
}
