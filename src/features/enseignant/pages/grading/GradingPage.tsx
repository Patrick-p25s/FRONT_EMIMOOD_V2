// pages/grading/GradingPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDateTime } from "@/lib/format";
import type { GradeItemInput } from "../../api/attempts";
import type { AttemptReview } from "../../api/types";
import { useAttemptReview } from "../../hooks/useAttempts";
import { useGradeAttempt } from "../../hooks/useGradeAttempt";
import { attemptStatusMeta, formatScore } from "../../lib/attemptMeta";
import { isManual } from "../../lib/questionRules";
import { QuestionGrade } from "./QuestionGrade";

type Draft = { points: string; feedback: string };
const EMPTY: Draft = { points: "", feedback: "" };

const parsePoints = (value: string): number | null => {
  const number = Number(value.replace(",", "."));
  return value.trim() !== "" && Number.isFinite(number) ? number : null;
};

function GradingForm({ review }: { review: AttemptReview }) {
  const navigate = useNavigate();
  const grade = useGradeAttempt();
  const details = review.details ?? [];
  const manualDetails = details.filter((detail) => isManual(detail.question_type));

  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(
      manualDetails.map((detail) => [
        detail.question_id,
        {
          points: detail.points_awarded === null ? "" : String(detail.points_awarded),
          feedback: detail.feedback ?? "",
        },
      ]),
    ),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const change = (id: string, patch: Partial<Draft>) =>
    setDrafts((current) => ({ ...current, [id]: { ...(current[id] ?? EMPTY), ...patch } }));

  // Note provisoire : points automatiques + points saisis.
  const total = details.reduce((sum, detail) => {
    if (!isManual(detail.question_type)) return sum + (detail.points_awarded ?? 0);
    const value = parsePoints((drafts[detail.question_id] ?? EMPTY).points);
    return sum + (value !== null && value >= 0 && value <= detail.points ? value : 0);
  }, 0);

  const submit = async () => {
    const nextErrors: Record<string, string> = {};
    const grades: GradeItemInput[] = [];
    for (const detail of manualDetails) {
      const draft = drafts[detail.question_id] ?? EMPTY;
      const value = parsePoints(draft.points);
      if (value === null || value < 0 || value > detail.points) {
        nextErrors[detail.question_id] = `Entre 0 et ${formatScore(detail.points)}`;
        continue;
      }
      const feedback = draft.feedback.trim();
      grades.push({
        question_id: detail.question_id,
        points_awarded: value,
        ...(feedback ? { feedback } : {}),
      });
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    try {
      await grade.mutateAsync({ id: review.attempt_id, grades });
      void navigate({
        to: "/enseignant/evaluations/$assessmentId",
        params: { assessmentId: review.assessment_id },
      });
    } catch {
      // message déjà affiché par la mutation
    }
  };

  const status = attemptStatusMeta(review.status);

  return (
    <>
      <Link
        to="/enseignant/evaluations/$assessmentId"
        params={{ assessmentId: review.assessment_id }}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Retour à l’évaluation
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <StatusPill tone={status.tone}>{status.label}</StatusPill>
          <h1 className="mt-2 truncate text-2xl font-extrabold tracking-tight">
            {review.student_name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Tentative {review.attempt_number}
            {review.submitted_at ? ` · rendue ${fmtDateTime(review.submitted_at)}` : ""}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-extrabold tracking-tight">
            {formatScore(total)}{" "}
            <span className="text-base font-medium text-muted-foreground">
              / {formatScore(review.max_score)}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">Note provisoire</p>
        </div>
      </div>

      {review.details === null ? (
        <p role="status" className="rounded-xl border bg-muted/50 p-4 text-sm">
          Le détail de cette copie n’est pas disponible.
        </p>
      ) : (
        <ol className="grid gap-3">
          {details.map((detail, index) => {
            const draft = drafts[detail.question_id] ?? EMPTY;
            return (
              <QuestionGrade
                key={detail.question_id}
                detail={detail}
                index={index}
                points={draft.points}
                feedback={draft.feedback}
                error={errors[detail.question_id]}
                onPoints={(value) => change(detail.question_id, { points: value })}
                onFeedback={(value) => change(detail.question_id, { feedback: value })}
              />
            );
          })}
        </ol>
      )}

      <div className="mt-6 flex items-center justify-end gap-3">
        {manualDetails.length === 0 ? (
          <p className="text-sm text-muted-foreground">Cette copie est corrigée automatiquement.</p>
        ) : (
          <Button onClick={() => void submit()} disabled={grade.isPending}>
            {grade.isPending ? "Enregistrement…" : "Enregistrer la correction"}
          </Button>
        )}
      </div>
    </>
  );
}

export function GradingPage({ attemptId }: { attemptId: string }) {
  const review = useAttemptReview(attemptId);
  if (review.error)
    return <ErrorState error={review.error} onRetry={() => void review.refetch()} />;
  if (review.isLoading || !review.data) return <Skeleton className="h-40 w-full" />;
  return <GradingForm key={review.data.attempt_id} review={review.data} />;
}
