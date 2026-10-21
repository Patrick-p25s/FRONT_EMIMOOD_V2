// pages/assessment-editor/QuestionCard.tsx
import { Check, Circle, Pencil, Trash2 } from "lucide-react";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { Button } from "@/components/ui/button";
import type { Question } from "../../api/types";
import { isManual, questionTypeLabel, validateQuestion } from "../../lib/questionRules";

type QuestionCardProps = {
  question: Question;
  index: number;
  locked: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export function QuestionCard({ question, index, locked, onEdit, onDelete }: QuestionCardProps) {
  const problem = validateQuestion(question);
  const choices = [...question.choices].sort((a, b) => a.position - b.position);

  return (
    <li className="rounded-xl border bg-card p-4 shadow-[var(--shadow)]">
      <div className="flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <p className="whitespace-pre-line font-medium">{question.content}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{questionTypeLabel(question.question_type)}</span>
            <span>·</span>
            <span>
              {question.points} pt{question.points > 1 ? "s" : ""}
            </span>
            {isManual(question.question_type) && (
              <StatusPill tone="info">Correction manuelle</StatusPill>
            )}
            {problem && <StatusPill tone="danger">{problem}</StatusPill>}
          </div>
        </div>
        {!locked && (
          <div className="flex shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Modifier la question ${index + 1}`}
              onClick={onEdit}
            >
              <Pencil className="size-4" aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={`Supprimer la question ${index + 1}`}
              onClick={onDelete}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        )}
      </div>

      {choices.length > 0 && (
        <ul className="mt-3 grid gap-1 pl-11 text-sm">
          {choices.map((choice) => (
            <li key={choice.id} className="flex items-center gap-2">
              {choice.is_correct ? (
                <Check className="size-4 shrink-0 text-success" aria-label="Bonne réponse" />
              ) : (
                <Circle className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <span className={choice.is_correct ? "font-medium" : "text-muted-foreground"}>
                {choice.content}
              </span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
