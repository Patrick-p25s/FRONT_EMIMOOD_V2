// pages/subject-detail/SubjectDetailPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Plus, Trash2 } from "lucide-react";
import { IconBox } from "@/components/emimood/atoms/IconBox";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fmtDate } from "@/lib/format";
import type { Course } from "../../api/types";
import { useCourseMutations } from "../../hooks/useCourseMutations";
import { useCourses } from "../../hooks/useCourses";
import { useMySubjects } from "../../hooks/useMySubjects";
import { COURSE_STATUS } from "../../lib/courseStatus";
import { CourseForm } from "./CourseForm";

export function SubjectDetailPage({ classSubjectId }: { classSubjectId: string }) {
  const navigate = useNavigate();
  const subjects = useMySubjects();
  const courses = useCourses(classSubjectId);
  const { remove } = useCourseMutations();
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<Course | null>(null);

  const found = (subjects.data ?? [])
    .flatMap((item) => item.classes.map((assignment) => ({ subject: item.subject, assignment })))
    .find((entry) => entry.assignment.class_subject_id === classSubjectId);

  const list = courses.data ?? [];

  return (
    <>
      <Link
        to="/enseignant/matieres"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Mes matières
      </Link>

      {subjects.isLoading ? (
        <Skeleton className="mb-6 h-14 w-full max-w-md" />
      ) : found ? (
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight">
              {found.subject.name}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {found.assignment.classe_name}
              {found.assignment.semester !== null ? ` · Semestre ${found.assignment.semester}` : ""}
            </p>
          </div>
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" aria-hidden /> Nouveau cours
          </Button>
        </div>
      ) : (
        <EmptyState
          title="Matière introuvable"
          description="Cette matière n’existe pas ou ne fait pas partie de vos affectations."
        />
      )}

      {found && (
        <Tabs defaultValue="courses">
          <TabsList>
            <TabsTrigger value="courses">Cours</TabsTrigger>
            <TabsTrigger value="assessments">Évaluations</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            {courses.error ? (
              <ErrorState error={courses.error} onRetry={() => void courses.refetch()} />
            ) : courses.isLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : list.length === 0 ? (
              <EmptyState
                title="Aucun cours pour le moment"
                description="Créez un cours, ajoutez-y des chapitres, puis publiez-le pour vos étudiants."
                action={<Button onClick={() => setCreating(true)}>Créer le premier cours</Button>}
              />
            ) : (
              <ul className="grid gap-2">
                {list.map((course) => {
                  const status = COURSE_STATUS[course.status];
                  return (
                    <li
                      key={course.id}
                      className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-(--shadow) transition-colors hover:border-primary/40"
                    >
                      <Link
                        to="/enseignant/cours/$courseId"
                        params={{ courseId: course.id }}
                        className="flex min-w-0 flex-1 items-center gap-3 no-underline"
                      >
                        <IconBox icon={BookOpen} tone="success" />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-foreground">{course.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Modifié le {fmtDate(course.updated_at)}
                          </p>
                        </div>
                      </Link>
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Supprimer ${course.title}`}
                        onClick={() => setDeleting(course)}
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="assessments" className="mt-6">
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Les évaluations arrivent à l’étape suivante.
            </p>
          </TabsContent>
        </Tabs>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau cours</DialogTitle>
            <DialogDescription>
              Il sera créé en brouillon, invisible des étudiants.
            </DialogDescription>
          </DialogHeader>
          <CourseForm
            classSubjectId={classSubjectId}
            onCancel={() => setCreating(false)}
            onSaved={(course) => {
              setCreating(false);
              void navigate({ to: "/enseignant/cours/$courseId", params: { courseId: course.id } });
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={deleting ? `Supprimer « ${deleting.title} » ?` : ""}
        description="Le cours disparaît pour vous et pour les étudiants."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await remove.mutateAsync(deleting.id);
            setDeleting(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </>
  );
}
