// pages/assessment-editor/AssessmentEditorPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { Panel } from "@/components/emimood/molecules/Panel";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { Question } from "../../api/types";
import { useAssessment, useQuestions } from "../../hooks/useAssessments";
import { useAssessmentMutations, useQuestionMutations } from "../../hooks/useAssessmentsMutations";
import { ASSESSMENT_STATUS, ASSESSMENT_TYPE_LABEL, phaseMeta } from "../../lib/assessmentMeta";
import { validateQuestion } from "../../lib/questionRules";
import { AssessmentForm } from "../assessments/AssessmentForm";
import { QuestionCard } from "./QuestionCard";
import { QuestionForm } from "./QuestionForm";
import { ResultsPanel } from "../assessment-results/ResultatsPanel";

const MAX_QUESTIONS = 100;

type QuestionDialog = { kind: "create" } | { kind: "edit"; question: Question } | null;
type Pending = "publish" | "archive" | "delete" | null;

const COPY = {
  publish: {
    title: "Publier cette évaluation ?",
    description:
      "Une fois publiée, elle ne pourra plus être modifiée, seulement archivée. Les étudiants de la classe seront notifiés.",
    confirm: "Publier",
    destructive: false,
  },
  archive: {
    title: "Archiver cette évaluation ?",
    description: "Elle disparaît pour les étudiants et ne peut pas revenir en brouillon.",
    confirm: "Archiver",
    destructive: true,
  },
  delete: {
    title: "Supprimer ce brouillon ?",
    description: "L’évaluation et ses questions seront supprimées définitivement.",
    confirm: "Supprimer",
    destructive: true,
  },
} as const;

export function AssessmentEditorPage({ assessmentId }: { assessmentId: string }) {
  const navigate = useNavigate();
  const assessment = useAssessment(assessmentId);
  const questions = useQuestions(assessmentId);
  const { setStatus, remove } = useAssessmentMutations();
  const questionMutations = useQuestionMutations();

  const [questionDialog, setQuestionDialog] = useState<QuestionDialog>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<Question | null>(null);
  const [pending, setPending] = useState<Pending>(null);

  if (assessment.error)
    return <ErrorState error={assessment.error} onRetry={() => void assessment.refetch()} />;
  if (assessment.isLoading || !assessment.data) return <Skeleton className="h-40 w-full" />;

  const current = assessment.data;
  const draft = current.status === "draft";
  const status = ASSESSMENT_STATUS[current.status];
  const phase = phaseMeta(current.phase);
  const list = questions.data ?? [];

  // « Prêt à publier ? » reprend les refus possibles du serveur.
  const firstProblem = list
    .map((question, index) => ({ index, message: validateQuestion(question) }))
    .find((entry) => entry.message);
  const endOk = !current.end_at || new Date(current.end_at).getTime() > Date.now();
  const checks = [
    { ok: list.length > 0, label: "Au moins une question" },
    {
      ok: !firstProblem,
      label: firstProblem
        ? `Question ${firstProblem.index + 1} : ${firstProblem.message}`
        : "Questions valides",
    },
    { ok: endOk, label: "Date de fin à venir (ou non renseignée)" },
  ];
  const canPublish = checks.every((check) => check.ok);

  const confirm = async () => {
    if (!pending) return;
    try {
      if (pending === "publish")
        await setStatus.mutateAsync({ id: current.id, status: "published" });
      if (pending === "archive")
        await setStatus.mutateAsync({ id: current.id, status: "archived" });
      if (pending === "delete") {
        await remove.mutateAsync(current.id);
        void navigate({
          to: "/enseignant/matieres/$classSubjectId",
          params: { classSubjectId: current.class_subject_id },
          search: { onglet: "evaluations" },
        });
      }
      setPending(null);
    } catch {
      // message déjà affiché par la mutation
    }
  };

  return (
    <>
      <Link
        to="/enseignant/matieres/$classSubjectId"
        params={{ classSubjectId: current.class_subject_id }}
        search={{ onglet: "evaluations" }}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Retour aux évaluations
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={status.tone}>{status.label}</StatusPill>
            {!draft && <StatusPill tone={phase.tone}>{phase.label}</StatusPill>}
            <span className="text-xs text-muted-foreground">
              {ASSESSMENT_TYPE_LABEL[current.assessment_type]}
            </span>
          </div>
          <h1 className="mt-2 truncate text-2xl font-extrabold tracking-tight">{current.title}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {draft && (
            <Button variant="ghost" onClick={() => setPending("delete")}>
              Supprimer
            </Button>
          )}
          {current.status !== "archived" && (
            <Button variant="outline" onClick={() => setPending("archive")}>
              Archiver
            </Button>
          )}
          {draft && (
            <Button disabled={!canPublish} onClick={() => setPending("publish")}>
              Publier
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {draft ? (
          <div className="rounded-xl border bg-card p-4 text-sm shadow-[var(--shadow)]">
            <p className="mb-2 font-semibold">Prêt à publier ?</p>
            <ul className="grid gap-1">
              {checks.map((check) => (
                <li
                  key={check.label}
                  className={check.ok ? "text-success" : "text-muted-foreground"}
                >
                  {check.ok ? "✓" : "○"} {check.label}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p role="status" className="rounded-xl border bg-muted/50 p-4 text-sm">
            Cette évaluation est figée : ni ses paramètres ni ses questions ne peuvent plus être
            modifiés. Vous pouvez seulement l’archiver.
          </p>
        )}

        {!draft && <ResultsPanel assessmentId={assessmentId} />}

        <Panel title="Paramètres">
          <AssessmentForm key={current.updated_at} assessment={current} onSaved={() => undefined} />
        </Panel>

        <section aria-labelledby="questions-title">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 id="questions-title" className="text-[15px] font-bold">
              Questions{list.length > 0 ? ` (${list.length})` : ""}
            </h2>
            {draft && (
              <Button
                variant="outline"
                size="sm"
                disabled={list.length >= MAX_QUESTIONS}
                onClick={() => setQuestionDialog({ kind: "create" })}
              >
                <Plus className="size-4" aria-hidden /> Ajouter une question
              </Button>
            )}
          </div>

          {questions.error ? (
            <ErrorState error={questions.error} onRetry={() => void questions.refetch()} />
          ) : questions.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : list.length === 0 ? (
            <EmptyState
              title="Aucune question"
              description="Ajoutez au moins une question pour pouvoir publier."
              action={
                draft ? (
                  <Button onClick={() => setQuestionDialog({ kind: "create" })}>
                    Ajouter une question
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <ol className="grid gap-3">
              {list.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  locked={!draft}
                  onEdit={() => setQuestionDialog({ kind: "edit", question })}
                  onDelete={() => setDeletingQuestion(question)}
                />
              ))}
            </ol>
          )}
        </section>
      </div>

      <Dialog
        open={questionDialog !== null}
        onOpenChange={(open) => !open && setQuestionDialog(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {questionDialog?.kind === "edit" ? "Modifier la question" : "Nouvelle question"}
            </DialogTitle>
          </DialogHeader>
          {questionDialog && (
            <QuestionForm
              key={questionDialog.kind === "edit" ? questionDialog.question.id : "new"}
              assessmentId={assessmentId}
              question={questionDialog.kind === "edit" ? questionDialog.question : undefined}
              onDone={() => setQuestionDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deletingQuestion !== null}
        onOpenChange={(open) => !open && setDeletingQuestion(null)}
        title="Supprimer cette question ?"
        description="Elle disparaît de l’évaluation."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deletingQuestion) return;
          try {
            await questionMutations.remove.mutateAsync(deletingQuestion.id);
            setDeletingQuestion(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(open) => !open && setPending(null)}
        title={pending ? COPY[pending].title : ""}
        description={pending ? COPY[pending].description : ""}
        confirmLabel={pending ? COPY[pending].confirm : "Confirmer"}
        destructive={pending ? COPY[pending].destructive : false}
        onConfirm={confirm}
      />
    </>
  );
}
