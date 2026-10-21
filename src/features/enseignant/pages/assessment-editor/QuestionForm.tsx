// pages/assessment-editor/QuestionForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { Question, QuestionType } from "../../api/types";
import { useQuestionMutations } from "../../hooks/useAssessmentsMutations";
import { questionSchema, type QuestionFormValues } from "../../lib/assessmentSchemas";
import {
  QUESTION_TYPES,
  defaultChoices,
  isManual,
  questionTypeLabel,
  validateChoices,
} from "../../lib/questionRules";

const SELECT = "h-9 w-full rounded-md border bg-background px-3 text-sm";

type QuestionFormProps = {
  assessmentId: string;
  question?: Question | undefined;
  onDone: () => void;
};

export function QuestionForm({ assessmentId, question, onDone }: QuestionFormProps) {
  const { create, update } = useQuestionMutations();
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: question
      ? {
          content: question.content,
          question_type: question.question_type,
          points: String(question.points),
          choices: [...question.choices]
            .sort((a, b) => a.position - b.position)
            .map((choice) => ({ content: choice.content, is_correct: choice.is_correct })),
        }
      : {
          content: "",
          question_type: "single_choice",
          points: "1",
          choices: defaultChoices("single_choice"),
        },
  });
  const { fields, append, remove, replace } = useFieldArray({ control, name: "choices" });

  const type = watch("question_type");
  const choices = watch("choices");
  const manual = isManual(type);
  const exclusive = type === "single_choice" || type === "true_false";

  const onSubmit = handleSubmit(async (values) => {
    const draft = values.choices.map((choice) => ({
      content: choice.content.trim(),
      is_correct: choice.is_correct,
    }));
    // Mêmes règles que le serveur : on guide avant l'envoi.
    const message = validateChoices(values.question_type, draft);
    if (message) {
      setError("root", { message });
      return;
    }
    const points = Number(values.points.replace(",", "."));
    try {
      if (question) {
        await update.mutateAsync({
          id: question.id,
          input: {
            content: values.content,
            points,
            ...(isManual(values.question_type) ? {} : { choices: draft }),
          },
        });
      } else {
        await create.mutateAsync({
          assessmentId,
          input: {
            content: values.content,
            question_type: values.question_type,
            points,
            choices: isManual(values.question_type) ? [] : draft,
          },
        });
      }
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, ["content", "points", "choices"]);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />

      <Field id="q-content" label="Question" error={errors.content?.message}>
        <Textarea
          id="q-content"
          rows={3}
          aria-invalid={!!errors.content}
          {...register("content")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-[1fr_8rem]">
        {question ? (
          <div className="grid gap-1.5">
            <span className="text-sm font-medium">Type</span>
            <p className="flex h-9 items-center text-sm">
              {questionTypeLabel(question.question_type)}
            </p>
          </div>
        ) : (
          <Field id="q-type" label="Type de question" error={errors.question_type?.message}>
            <select
              id="q-type"
              className={SELECT}
              {...register("question_type", {
                // Changer de type remet les choix par défaut de ce type.
                onChange: (event: { target: { value: string } }) =>
                  replace(defaultChoices(event.target.value as QuestionType)),
              })}
            >
              {QUESTION_TYPES.map((entry) => (
                <option key={entry.value} value={entry.value}>
                  {entry.label}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field id="q-points" label="Points" error={errors.points?.message}>
          <Input
            id="q-points"
            inputMode="decimal"
            aria-invalid={!!errors.points}
            {...register("points")}
          />
        </Field>
      </div>

      {manual ? (
        <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
          Correction manuelle : vous attribuerez les points copie par copie, avec un commentaire.
        </p>
      ) : (
        <fieldset className="grid gap-2">
          <legend className="mb-1 text-sm font-medium">
            Choix{" "}
            <span className="font-normal text-muted-foreground">
              — cochez {exclusive ? "la bonne réponse" : "les bonnes réponses"}
            </span>
          </legend>

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                type={exclusive ? "radio" : "checkbox"}
                name="correct-choice"
                checked={choices[index]?.is_correct ?? false}
                aria-label={`Choix ${index + 1} : bonne réponse`}
                onChange={(event) =>
                  exclusive
                    ? replace(
                        choices.map((choice, position) => ({
                          ...choice,
                          is_correct: position === index,
                        })),
                      )
                    : setValue(`choices.${index}.is_correct`, event.target.checked, {
                        shouldDirty: true,
                      })
                }
              />
              <Input
                aria-label={`Texte du choix ${index + 1}`}
                autoComplete="off"
                readOnly={type === "true_false"}
                {...register(`choices.${index}.content` as const)}
              />
              {type !== "true_false" && fields.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label={`Retirer le choix ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  <X className="size-4" aria-hidden />
                </Button>
              )}
            </div>
          ))}

          {errors.choices?.message && (
            <p role="alert" className="text-xs text-destructive">
              {errors.choices.message}
            </p>
          )}

          {type !== "true_false" && fields.length < 10 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-fit text-primary"
              onClick={() => append({ content: "", is_correct: false })}
            >
              <Plus className="size-4" aria-hidden /> Ajouter un choix
            </Button>
          )}
        </fieldset>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : question ? "Enregistrer" : "Ajouter la question"}
        </Button>
      </div>
    </form>
  );
}
