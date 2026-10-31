import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SessionQuestion } from "../../api/assessmentSchemas";

export type Draft = { choices: string[]; text: string };
export const EMPTY_DRAFT: Draft = { choices: [], text: "" };

export const isChoiceQuestion = (type: SessionQuestion["question_type"]) =>
  type === "single_choice" || type === "multiple_choice" || type === "true_false";

export const isAnswered = (question: SessionQuestion, draft: Draft | undefined): boolean =>
  !draft
    ? false
    : isChoiceQuestion(question.question_type)
      ? draft.choices.length > 0
      : draft.text.trim() !== "";

type QuestionBlockProps = {
  question: SessionQuestion;
  index: number;
  draft: Draft;
  disabled: boolean;
  onChange: (draft: Draft) => void;
};

export function QuestionBlock({ question, index, draft, disabled, onChange }: QuestionBlockProps) {
  const multiple = question.question_type === "multiple_choice";
  const choices = [...question.choices].sort((a, b) => a.position - b.position);

  return (
    <fieldset className="item-card" disabled={disabled}>
      <legend className="sr-only">Question {index + 1}</legend>
      <h2 className="text-base">
        {index + 1}. {question.content}
      </h2>
      <p className="small">
        {question.points} point{question.points > 1 ? "s" : ""}
        {multiple ? " · plusieurs réponses possibles" : ""}
      </p>

      <div className="mt-2 flex flex-col gap-2">
        {isChoiceQuestion(question.question_type) &&
          choices.map((choice) => {
            const chosen = draft.choices.includes(choice.id);
            return (
              <label
                key={choice.id}
                className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${chosen ? "border-primary" : ""}`}
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  name={`q-${question.id}`}
                  checked={chosen}
                  className="accent-[var(--primary)]"
                  onChange={() =>
                    onChange({
                      ...draft,
                      choices: multiple
                        ? chosen
                          ? draft.choices.filter((id) => id !== choice.id)
                          : [...draft.choices, choice.id]
                        : [choice.id],
                    })
                  }
                />
                <span className="flex-1">{choice.content}</span>
              </label>
            );
          })}

        {question.question_type === "short_answer" && (
          <Input
            aria-label={`Réponse à la question ${index + 1}`}
            maxLength={500}
            autoComplete="off"
            value={draft.text}
            onChange={(event) => onChange({ ...draft, text: event.target.value })}
          />
        )}

        {question.question_type === "open_answer" && (
          <>
            <Textarea
              aria-label={`Réponse à la question ${index + 1}`}
              rows={6}
              maxLength={5000}
              value={draft.text}
              onChange={(event) => onChange({ ...draft, text: event.target.value })}
            />
            <p className="small text-right">{draft.text.length} / 5000</p>
          </>
        )}
      </div>
    </fieldset>
  );
}
