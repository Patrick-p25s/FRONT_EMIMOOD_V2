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
import type { Chapter, ChapterDocument, CourseResource } from "../../api/types";
import {
  useChapterMutations,
  useCourseMutations,
  useDocumentMutations, // NOUVEAU
  useResourceMutations,
} from "../../hooks/useCourseMutations";
import { useChapters, useCourse } from "../../hooks/useCourses";
import { COURSE_STATUS } from "../../lib/courseStatus";
import { CourseForm } from "../subject-detail/CourseForm";
import { ChapterCard } from "./ChapterCard";
import { ChapterForm } from "./ChapterForm";
import { DocumentForm } from "./DocumentForm"; // NOUVEAU
import { ResourceForm } from "./ResourceForm";

type ChapterDialog = { kind: "create" } | { kind: "edit"; chapter: Chapter } | null;
type ResourceDialog =
  | { kind: "create"; chapter: Chapter }
  | { kind: "edit"; chapter: Chapter; resource: CourseResource }
  | null;
// NOUVEAU
type DocumentDialog =
  | { kind: "create"; chapter: Chapter }
  | { kind: "edit"; chapter: Chapter; document: ChapterDocument }
  | null;

export function CourseEditorPage({ courseId }: { courseId: string }) {
  const course = useCourse(courseId);
  const chapters = useChapters(courseId);
  const { setStatus } = useCourseMutations();
  const chapterMutations = useChapterMutations();
  const resourceMutations = useResourceMutations();
  const documentMutations = useDocumentMutations(); // NOUVEAU

  const [chapterDialog, setChapterDialog] = useState<ChapterDialog>(null);
  const [resourceDialog, setResourceDialog] = useState<ResourceDialog>(null);
  const [documentDialog, setDocumentDialog] = useState<DocumentDialog>(null); // NOUVEAU
  const [deletingChapter, setDeletingChapter] = useState<Chapter | null>(null);
  const [deletingResource, setDeletingResource] = useState<CourseResource | null>(null);
  const [deletingDocument, setDeletingDocument] = useState<ChapterDocument | null>(null); // NOUVEAU

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
          <div className="rounded-xl border bg-card p-4 text-sm shadow-[var(--shadow)]">
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
                  onAddResource={() => setResourceDialog({ kind: "create", chapter })}
                  onEditResource={(resource) =>
                    setResourceDialog({ kind: "edit", chapter, resource })
                  }
                  onDeleteResource={setDeletingResource}
                  onAddDocument={() => setDocumentDialog({ kind: "create", chapter })} // NOUVEAU
                  onEditDocument={(document) =>
                    setDocumentDialog({ kind: "edit", chapter, document })
                  } // NOUVEAU
                  onDeleteDocument={setDeletingDocument} // NOUVEAU
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

      {/* Dialogues : lien */}
      <Dialog
        open={resourceDialog !== null}
        onOpenChange={(open) => !open && setResourceDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {resourceDialog?.kind === "edit" ? "Modifier le lien" : "Nouveau lien"}
            </DialogTitle>
          </DialogHeader>
          {resourceDialog && (
            <ResourceForm
              key={
                resourceDialog.kind === "edit"
                  ? resourceDialog.resource.id
                  : `new-${resourceDialog.chapter.id}`
              }
              chapterId={resourceDialog.chapter.id}
              resource={resourceDialog.kind === "edit" ? resourceDialog.resource : undefined}
              onDone={() => setResourceDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* NOUVEAU : dialogue document téléversé */}
      <Dialog
        open={documentDialog !== null}
        onOpenChange={(open) => !open && setDocumentDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {documentDialog?.kind === "edit" ? "Modifier le document" : "Téléverser un document"}
            </DialogTitle>
          </DialogHeader>
          {documentDialog && (
            <DocumentForm
              key={
                documentDialog.kind === "edit"
                  ? documentDialog.document.id
                  : `new-${documentDialog.chapter.id}`
              }
              chapterId={documentDialog.chapter.id}
              document={documentDialog.kind === "edit" ? documentDialog.document : undefined}
              onDone={() => setDocumentDialog(null)}
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

      {/* NOUVEAU */}
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
      />
    </>
  );
}
