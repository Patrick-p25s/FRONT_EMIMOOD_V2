// pages/result/ResultPage.tsx
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Heading } from "@/components/emimood/molecules/Heading";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AnswerDetail } from "../../api/assessmentSchemas";
import { useAttemptResult, useStudentAssessment } from "../../hooks/useAttempts";
import { formatScore } from "../../lib/assessments";
import { isNotFound } from "../../lib/messages";

function AnswerReview({ detail, index }: { detail: AnswerDetail; index: number }) {
  const choices = [...detail.choices].sort((a, b) => a.position - b.position);
  const manual = detail.question_type === "short_answer" || detail.question_type === "open_answer";

  return (
    <article className="item-card">
      <h2 className="text-base">
        {index + 1}. {detail.content}
      </h2>
      <p className="small">
        {detail.points_awarded !== null ? `${formatScore(detail.points_awarded)} / ` : "— / "}
        {formatScore(detail.points)} point{detail.points > 1 ? "s" : ""}
      </p>

      {manual ? (
        <div className="mt-2 grid gap-2">
          <p className="whitespace-pre-wrap rounded-md border p-3 text-sm">
            {detail.answer_text?.trim() ? (
              detail.answer_text
            ) : (
              <span className="small">Aucune réponse</span>
            )}
          </p>
          {detail.feedback && (
            <p className="rounded-md bg-muted/50 p-3 text-sm">
              <span className="font-semibold">Commentaire de l’enseignant : </span>
              {detail.feedback}
            </p>
          )}
        </div>
      ) : (
        <div className="mt-2 flex flex-col gap-2">
          {choices.map((choice) => {
            const chosen = detail.selected_choice_ids.includes(choice.id);
            const correct = choice.is_correct;
            const wrong = chosen && !correct;
            return (
              <div
                key={choice.id}
                className={`flex items-center gap-3 rounded-md border p-3 ${chosen ? "border-primary" : ""} ${correct ? "border-success bg-success/10" : ""} ${wrong ? "border-destructive bg-destructive/10" : ""}`}
              >
                <span className="flex-1">{choice.content}</span>
                {chosen && <span className="small">Votre choix</span>}
                {correct && (
                  <CheckCircle2 size={18} className="text-success" aria-label="Bonne réponse" />
                )}
                {wrong && (
                  <XCircle size={18} className="text-destructive" aria-label="Mauvaise réponse" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </article>
  );
}

export function ResultPage({ attemptId }: { attemptId: string }) {
  const result = useAttemptResult(attemptId);
  const assessment = useStudentAssessment(result.data?.assessment_id ?? "");

  const back = (
    <Link
      to="/evaluations"
      className={cn(buttonVariants({ variant: "ghost" }), "mb-3 no-underline")}
    >
      <ArrowLeft /> Retour aux évaluations
    </Link>
  );

  if (result.error) {
    return (
      <div className="page">
        {back}
        {isNotFound(result.error) ? (
          <EmptyState
            title="Résultat indisponible"
            description="Ce résultat n’est pas (ou plus) disponible."
          />
        ) : (
          <ErrorState error={result.error} onRetry={() => void result.refetch()} />
        )}
      </div>
    );
  }
  if (result.isLoading || !result.data) {
    return (
      <div className="page">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const data = result.data;
  const sur20 =
    data.score !== null && data.max_score > 0 ? (data.score / data.max_score) * 20 : null;

  return (
    <div className="page">
      {back}
      <Heading
        title={assessment.data?.title ?? "Résultat"}
        subtitle={`Tentative ${data.attempt_number}`}
      />

      <div className="item-card mb-5">
        {data.score !== null ? (
          <>
            <h2>
              Résultat : {formatScore(data.score)} / {formatScore(data.max_score)}
            </h2>
            {sur20 !== null && <p className="small">Soit {formatScore(sur20)} / 20</p>}
          </>
        ) : (
          <>
            <h2>Note en attente de correction</h2>
            <p>Votre enseignant doit encore corriger certaines réponses. Revenez plus tard.</p>
          </>
        )}
      </div>

      {data.details === null ? (
        <p className="small">Le détail de la correction n’est pas disponible pour le moment.</p>
      ) : (
        <div className="flex max-w-3xl flex-col gap-4">
          {data.details.map((detail, index) => (
            <AnswerReview key={detail.question_id} detail={detail} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
