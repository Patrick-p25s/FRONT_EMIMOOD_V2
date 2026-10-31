// pages/grading/QuestionGrade.tsx
import { Check, Circle, X } from "lucide-react";
import { Field } from "@/components/emimood/molecules/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AnswerDetail } from "../../api/types";
import { formatScore } from "../../lib/attemptMeta";
import { isManual, questionTypeLabel } from "../../lib/questionRules";

type QuestionGradeProps = {
  detail: AnswerDetail;
  index: number;
  points: string;
  feedback: string;
  error?: string | undefined;
  onPoints: (value: string) => void;
  onFeedback: (value: string) => void;
};

export function QuestionGrade({
  detail,
  index,
  points,
  feedback,
  error,
  onPoints,
  onFeedback,
}: QuestionGradeProps) {
  const manual = isManual(detail.question_type);
  const choices = [...detail.choices].sort((a, b) => a.position - b.position);

  return (
    <li className="rounded-xl border bg-card p-4 shadow-(--shadow)">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="whitespace-pre-line font-medium">{detail.content}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {questionTypeLabel(detail.question_type)} · {formatScore(detail.points)} pt
            {detail.points > 1 ? "s" : ""}
          </p>
        </div>
        {!manual && (
          <span className="shrink-0 text-sm font-semibold">
            {formatScore(detail.points_awarded ?? 0)} / {formatScore(detail.points)}
          </span>
        )}
      </div>

      {manual ? (
        <div className="mt-3 grid gap-3 pl-11">
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground">Réponse de l’étudiant</p>
            <p className="whitespace-pre-wrap rounded-lg bg-muted/50 p-3 text-sm">
              {detail.answer_text?.trim() ? (
                detail.answer_text
              ) : (
                <span className="text-muted-foreground">Aucune réponse</span>
              )}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
            <Field
              id={`pts-${detail.question_id}`}
              label={`Points (max ${formatScore(detail.points)})`}
              error={error}
            >
              <Input
                id={`pts-${detail.question_id}`}
                inputMode="decimal"
                value={points}
                aria-invalid={!!error}
                onChange={(event) => onPoints(event.target.value)}
              />
            </Field>
            <Field id={`fb-${detail.question_id}`} label="Commentaire" hint="Facultatif.">
              <Textarea
                id={`fb-${detail.question_id}`}
                rows={2}
                value={feedback}
                onChange={(event) => onFeedback(event.target.value)}
              />
            </Field>
          </div>
        </div>
      ) : (
        <ul className="mt-3 grid gap-1 pl-11 text-sm">
          {choices.map((choice) => {
            const selected = detail.selected_choice_ids.includes(choice.id);
            return (
              <li key={choice.id} className="flex items-center gap-2">
                {selected && choice.is_correct ? (
                  <Check
                    className="size-4 shrink-0 text-success"
                    aria-label="Choisi, bonne réponse"
                  />
                ) : selected ? (
                  <X
                    className="size-4 shrink-0 text-destructive"
                    aria-label="Choisi, mauvaise réponse"
                  />
                ) : choice.is_correct ? (
                  <Check
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-label="Bonne réponse non choisie"
                  />
                ) : (
                  <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                )}
                <span className={selected ? "font-medium" : "text-muted-foreground"}>
                  {choice.content}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
