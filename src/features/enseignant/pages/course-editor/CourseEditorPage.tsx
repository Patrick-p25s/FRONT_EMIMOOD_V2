import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { Panel } from "@/components/emimood/molecules/Panel";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Chapter } from "../../api/types";
import { useChapterMutations, useCourseMutations } from "../../hooks/useCourseMutations";
import { useChapters, useCourse } from "../../hooks/useCourses";
import { COURSE_STATUS } from "../../lib/courseStatus";
import { CourseForm } from "../subject-detail/CourseForm";
import { ChapterCard } from "./ChapterCard";
import { ChapterForm } from "./ChapterForm";
import { CourseResource } from "@/features/course-ressources/api/schemas";
import { useCourseResourceMutations } from "@/features/course-ressources/hooks/useCourseRessources";

type ChapterDialog = { kind: "create" } | { kind: "edit"; chapter: Chapter } | null;

export function CourseEditorPage({ courseId }: { courseId: string }) {
  const course = useCourse(courseId);
  const chapters = useChapters(courseId);
  const { setStatus } = useCourseMutations();
  const chapterMutations = useChapterMutations();
  const resourceMutations = useCourseResourceMutations();

  const [chapterDialog, setChapterDialog] = useState<ChapterDialog>(null);
  const [deletingChapter, setDeletingChapter] = useState<Chapter | null>(null);
  const [deletingResource, setDeletingResource] = useState<CourseResource | null>(null);

  if (course.error)
    return <ErrorState error={course.error} onRetry={() => void course.refetch()} />;
  if (course.isLoading || !course.data) return <Skeleton className="h-40 w-full" />;

  const current = course.data;
  const status = COURSE_STATUS[current.status];
  const list = chapters.data ?? [];
  const canPublish = list.length > 0;

  const move = (index: number, direction: -1 | 1) => {
    const chapter = list[index];
    const other = list[index + direction];
    if (chapter && other) chapterMutations.swap.mutate({ a: chapter, b: other });
  };

  return (
    <>
      <Link
        to="/enseignant/matieres/$classSubjectId"
        params={{ classSubjectId: current.class_subject_id }}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Retour aux cours
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <StatusPill tone={status.tone}>{status.label}</StatusPill>
          <h1 className="mt-2 truncate text-2xl font-extrabold tracking-tight">{current.title}</h1>
        </div>
        <div className="flex gap-2">
          {current.status === "published" ? (
            <Button
              variant="outline"
              disabled={setStatus.isPending}
              onClick={() => setStatus.mutate({ id: current.id, status: "archived" })}
            >
              Archiver
            </Button>
          ) : (
            <Button
              disabled={!canPublish || setStatus.isPending}
              onClick={() => setStatus.mutate({ id: current.id, status: "published" })}
            >
              Publier
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {current.status !== "published" && (
          <div className="rounded-xl border bg-card p-4 text-sm shadow-(--shadow)">
            <p className="mb-2 font-semibold">Prêt à publier ?</p>
            <p className={canPublish ? "text-success" : "text-muted-foreground"}>
              {canPublish ? "✓" : "○"} Au moins un chapitre
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              À la publication, les étudiants de la classe sont notifiés.
            </p>
          </div>
        )}

        <Panel title="Informations">
          <CourseForm key={current.updated_at} course={current} onSaved={() => undefined} />
        </Panel>

        <section aria-labelledby="chapters-title">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="chapters-title" className="text-[15px] font-bold">
              Chapitres
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setChapterDialog({ kind: "create" })}
            >
              <Plus className="size-4" aria-hidden /> Ajouter un chapitre
            </Button>
          </div>

          {chapters.error ? (
            <ErrorState error={chapters.error} onRetry={() => void chapters.refetch()} />
          ) : chapters.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : list.length === 0 ? (
            <EmptyState
              title="Aucun chapitre"
              description="Ajoutez un premier chapitre : il est nécessaire pour publier le cours."
            />
          ) : (
            <ol className="grid gap-3">
              {list.map((chapter, index) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  index={index}
                  total={list.length}
                  onMove={(direction) => move(index, direction)}
                  onEdit={() => setChapterDialog({ kind: "edit", chapter })}
                  onDelete={() => setDeletingChapter(chapter)}
                />
              ))}
            </ol>
          )}
        </section>
      </div>

      {/* Dialogues : chapitre */}
      <Dialog
        open={chapterDialog !== null}
        onOpenChange={(open) => !open && setChapterDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {chapterDialog?.kind === "edit" ? "Modifier le chapitre" : "Nouveau chapitre"}
            </DialogTitle>
          </DialogHeader>
          {chapterDialog && (
            <ChapterForm
              key={chapterDialog.kind === "edit" ? chapterDialog.chapter.id : "new"}
              courseId={courseId}
              chapter={chapterDialog.kind === "edit" ? chapterDialog.chapter : undefined}
              onDone={() => setChapterDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmations de suppression */}
      <ConfirmDialog
        open={deletingChapter !== null}
        onOpenChange={(open) => !open && setDeletingChapter(null)}
        title={deletingChapter ? `Supprimer « ${deletingChapter.title} » ?` : ""}
        description="Refusé par le serveur tant que le chapitre contient des ressources : supprimez-les d’abord."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deletingChapter) return;
          try {
            await chapterMutations.remove.mutateAsync(deletingChapter.id);
            setDeletingChapter(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />

      <ConfirmDialog
        open={deletingResource !== null}
        onOpenChange={(open) => !open && setDeletingResource(null)}
        title={deletingResource ? `Supprimer « ${deletingResource.title} » ?` : ""}
        description="Le lien disparaît du chapitre."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deletingResource) return;
          try {
            await resourceMutations.remove.mutateAsync(deletingResource.id);
            setDeletingResource(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />

      {/* NOUVEAU
      <ConfirmDialog
        open={deletingDocument !== null}
        onOpenChange={(open) => !open && setDeletingDocument(null)}
        title={deletingDocument ? `Supprimer « ${deletingDocument.title} » ?` : ""}
        description="Le fichier est supprimé du chapitre."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deletingDocument) return;
          try {
            await documentMutations.remove.mutateAsync(deletingDocument.id);
            setDeletingDocument(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      /> */}
    </>
  );
}
