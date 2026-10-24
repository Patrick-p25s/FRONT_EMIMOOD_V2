// pages/attempt/AttemptPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { toast } from "sonner";
import { Heading } from "@/components/emimood/molecules/Heading";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnswerInput, AttemptSession } from "../../api/assessmentSchemas";
import { studentAssessmentsApi } from "../../api/assessments";
import { useAttemptSession, useStudentAssessment, useSubmitAttempt } from "../../hooks/useAttempts";
import { formatClock, typeLabel } from "../../lib/assessments";
import { isNotFound } from "../../lib/messages";
import {
  EMPTY_DRAFT,
  QuestionBlock,
  isAnswered,
  isChoiceQuestion,
  type Draft,
} from "./QuestionBlock";

type SaveState = "idle" | "saving" | "saved" | "error";

function useRemaining(expiresAt: string | null, offset: number): number | null {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!expiresAt) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);
  // L'horloge de référence est celle du serveur (offset), pas celle de l'appareil.
  return expiresAt ? Math.max(0, Date.parse(expiresAt) - (now + offset)) : null;
}

function AttemptRunner({ session }: { session: AttemptSession }) {
  const navigate = useNavigate();
  const submit = useSubmitAttempt();
  const { attempt } = session;
  const assessment = useStudentAssessment(attempt.assessment_id);

  const questions = useMemo(
    () => [...session.questions].sort((a, b) => a.position - b.position),
    [session.questions],
  );
  const [drafts, setDrafts] = useState<Record<string, Draft>>(() =>
    Object.fromEntries(
      session.answers.map((a) => [
        a.question_id,
        { choices: a.selected_choice_ids, text: a.answer_text ?? "" },
      ]),
    ),
  );
  const [touched, setTouched] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [clock, setClock] = useState(() => ({
    expiresAt: attempt.expires_at,
    offset: Date.parse(session.server_time) - Date.now(),
  }));
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const finishing = useRef(false);

  const remaining = useRemaining(clock.expiresAt, clock.offset);

  const payload = useMemo<AnswerInput[]>(
    () =>
      questions.flatMap((question) => {
        const draft = drafts[question.id];
        if (!draft) return [];
        const choice = isChoiceQuestion(question.question_type);
        return [
          {
            question_id: question.id,
            selected_choice_ids: choice ? draft.choices : [],
            answer_text: choice ? null : draft.text,
          },
        ];
      }),
    [questions, drafts],
  );

  const save = useCallback(async (): Promise<boolean> => {
    setSaveState("saving");
    try {
      const out = await studentAssessmentsApi.saveAnswers(attempt.id, payload);
      setClock({ expiresAt: out.expires_at, offset: Date.parse(out.server_time) - Date.now() });
      setSaveState("saved");
      return true;
    } catch {
      setSaveState("error");
      return false;
    }
  }, [attempt.id, payload]);

  // Enregistrement automatique, 0,8 s après la dernière modification.
  useEffect(() => {
    if (!touched) return;
    const timer = setTimeout(() => void save(), 800);
    return () => clearTimeout(timer);
  }, [touched, save]);

  const goToResult = () =>
    void navigate({
      to: "/evaluations/result/$attemptId",
      params: { attemptId: attempt.id },
      replace: true,
    });

  const finish = async (auto: boolean) => {
    if (finishing.current) return;
    finishing.current = true;
    setBusy(true);
    const saved = await save();
    if (!saved && !auto) {
      toast.error(
        "Vos réponses n’ont pas pu être enregistrées. Vérifiez votre connexion et réessayez.",
      );
      finishing.current = false;
      setBusy(false);
      return;
    }
    try {
      await submit.mutateAsync(attempt.id);
    } catch {
      if (!auto) {
        finishing.current = false;
        setBusy(false);
        return;
      }
    }
    goToResult();
  };

  // Temps écoulé : soumission automatique.
  const expired = remaining === 0;
  useEffect(() => {
    if (expired) void finish(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expired]);

  const leave = async () => {
    if (touched) await save();
    void navigate({ to: "/evaluations" });
  };

  const answered = questions.filter((question) => isAnswered(question, drafts[question.id])).length;
  const total = questions.length;
  const title = assessment.data?.title ?? "Évaluation";
  const kind = assessment.data ? typeLabel(assessment.data.assessment_type) : "Évaluation";

  return (
    <div>
      <Button variant="ghost" onClick={() => void leave()} className="mb-3">
        <ArrowLeft /> Quitter (réponses enregistrées)
      </Button>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <Heading
          title={title}
          subtitle={`${total} question${total > 1 ? "s" : ""} · ${kind} · tentative ${attempt.attempt_number}`}
        />
        {remaining !== null && (
          <span
            className={`tag inline-flex items-center gap-1.5 ${remaining < 5 * 60_000 ? "text-destructive" : ""}`}
            role="timer"
            aria-label="Temps restant"
          >
            <Clock size={14} aria-hidden /> {formatClock(remaining)}
          </span>
        )}
      </div>

      <p className="small mb-3" role="status">
        {saveState === "saving" && "Enregistrement…"}
        {saveState === "saved" && "Réponses enregistrées"}
        {saveState === "error" && (
          <>
            Non enregistré.{" "}
            <button type="button" className="underline" onClick={() => void save()}>
              Réessayer
            </button>
          </>
        )}
      </p>

      <div className="flex max-w-3xl flex-col gap-4">
        {questions.map((question, index) => (
          <QuestionBlock
            key={question.id}
            question={question}
            index={index}
            draft={drafts[question.id] ?? EMPTY_DRAFT}
            disabled={busy}
            onChange={(draft) => {
              setDrafts((current) => ({ ...current, [question.id]: draft }));
              setTouched(true);
            }}
          />
        ))}
        <Button disabled={busy || total === 0} onClick={() => setConfirming(true)}>
          {busy ? "Envoi…" : `Soumettre mes réponses (${answered}/${total})`}
        </Button>
      </div>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Soumettre vos réponses ?"
        description={
          answered < total
            ? `${total - answered} question${total - answered > 1 ? "s sont" : " est"} sans réponse. Une fois soumises, vos réponses ne pourront plus être modifiées.`
            : "Une fois soumises, vos réponses ne pourront plus être modifiées."
        }
        confirmLabel="Soumettre"
        onConfirm={async () => {
          setConfirming(false);
          await finish(false);
        }}
      />
    </div>
  );
}

export function AttemptPage({ attemptId }: { attemptId: string }) {
  const session = useAttemptSession(attemptId);

  if (session.error) {
    return (
      <div className="page">
        {isNotFound(session.error) ? (
          <EmptyState
            title="Contenu indisponible"
            description="Cette tentative n’est plus disponible."
          />
        ) : (
          <ErrorState error={session.error} onRetry={() => void session.refetch()} />
        )}
      </div>
    );
  }
  if (session.isLoading || !session.data) {
    return (
      <div className="page">
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }
  // Déjà rendue : on va directement au résultat.
  if (session.data.attempt.submitted_at !== null) {
    return <Navigate to="/evaluations/result/$attemptId" params={{ attemptId }} replace />;
  }
  return (
    <div className="page">
      <AttemptRunner key={attemptId} session={session.data} />
    </div>
  );
}
