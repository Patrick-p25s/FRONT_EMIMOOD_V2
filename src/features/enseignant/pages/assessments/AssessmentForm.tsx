// pages/assessments/AssessmentForm.tsx : création, et paramètres dans l'éditeur
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { Assessment } from "../../api/types";
import { useAssessmentMutations } from "../../hooks/useAssessmentsMutations";
import { ASSESSMENT_TYPE_LABEL } from "../../lib/assessmentMeta";
import { assessmentSchema, type AssessmentFormValues } from "../../lib/assessmentSchemas";
import { fromLocalInput, toLocalInput } from "../../lib/dates";

const SELECT = "h-9 w-full rounded-md border bg-background px-3 text-sm";
const FIELDS = [
  "title",
  "description",
  "assessment_type",
  "start_at",
  "end_at",
  "duration_minutes",
  "max_attempts",
  "show_correction",
];

type AssessmentFormProps = {
  classSubjectId?: string | undefined;
  assessment?: Assessment | undefined;
  onCancel?: (() => void) | undefined;
  onSaved: (assessment: Assessment) => void;
};

export function AssessmentForm({
  classSubjectId,
  assessment,
  onCancel,
  onSaved,
}: AssessmentFormProps) {
  const { create, update } = useAssessmentMutations();
  // Une évaluation publiée ou archivée est figée.
  const locked = !!assessment && assessment.status !== "draft";
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: assessment?.title ?? "",
      description: assessment?.description ?? "",
      assessment_type: assessment?.assessment_type ?? "quiz",
      start_at: toLocalInput(assessment?.start_at),
      end_at: toLocalInput(assessment?.end_at),
      duration_minutes: assessment?.duration_minutes ? String(assessment.duration_minutes) : "",
      max_attempts: String(assessment?.max_attempts ?? 1),
      show_correction: assessment?.show_correction ?? true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const saved = assessment
        ? await update.mutateAsync({
            id: assessment.id,
            input: {
              title: values.title,
              description: values.description || null,
              assessment_type: values.assessment_type,
              start_at: values.start_at ? fromLocalInput(values.start_at) : null,
              end_at: values.end_at ? fromLocalInput(values.end_at) : null,
              duration_minutes: values.duration_minutes ? Number(values.duration_minutes) : null,
              max_attempts: Number(values.max_attempts),
              show_correction: values.show_correction,
            },
          })
        : await create.mutateAsync({
            class_subject_id: classSubjectId ?? "",
            title: values.title,
            ...(values.description ? { description: values.description } : {}),
            assessment_type: values.assessment_type,
            ...(values.start_at ? { start_at: fromLocalInput(values.start_at) } : {}),
            ...(values.end_at ? { end_at: fromLocalInput(values.end_at) } : {}),
            ...(values.duration_minutes
              ? { duration_minutes: Number(values.duration_minutes) }
              : {}),
            max_attempts: Number(values.max_attempts),
            show_correction: values.show_correction,
          });
      reset(values);
      onSaved(saved as Assessment);
    } catch (error) {
      applyServerErrors(error, setError, FIELDS);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />

      <fieldset disabled={locked} className="grid gap-4">
        <Field id="as-title" label="Titre" error={errors.title?.message}>
          <Input
            id="as-title"
            autoComplete="off"
            aria-invalid={!!errors.title}
            {...register("title")}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="as-type" label="Type" error={errors.assessment_type?.message}>
            <select id="as-type" className={SELECT} {...register("assessment_type")}>
              {Object.entries(ASSESSMENT_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            id="as-attempts"
            label="Tentatives autorisées"
            error={errors.max_attempts?.message}
          >
            <Input
              id="as-attempts"
              inputMode="numeric"
              aria-invalid={!!errors.max_attempts}
              {...register("max_attempts")}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="as-start"
            label="Début"
            error={errors.start_at?.message}
            hint="Facultatif. Heure locale."
          >
            <Input
              id="as-start"
              type="datetime-local"
              aria-invalid={!!errors.start_at}
              {...register("start_at")}
            />
          </Field>
          <Field
            id="as-end"
            label="Fin"
            error={errors.end_at?.message}
            hint="Facultatif, mais obligatoire dans le futur pour publier."
          >
            <Input
              id="as-end"
              type="datetime-local"
              aria-invalid={!!errors.end_at}
              {...register("end_at")}
            />
          </Field>
        </div>

        <Field
          id="as-duration"
          label="Durée (minutes)"
          error={errors.duration_minutes?.message}
          hint="Facultatif. Vide = sans limite."
        >
          <Input
            id="as-duration"
            inputMode="numeric"
            aria-invalid={!!errors.duration_minutes}
            {...register("duration_minutes")}
          />
        </Field>

        <Field
          id="as-description"
          label="Consignes"
          error={errors.description?.message}
          hint="Facultatif."
        >
          <Textarea
            id="as-description"
            rows={3}
            aria-invalid={!!errors.description}
            {...register("description")}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("show_correction")} />
          Montrer la correction aux étudiants une fois l’évaluation terminée
        </label>
      </fieldset>

      {!locked && (
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting || (!!assessment && !isDirty)}>
            {isSubmitting ? "Enregistrement…" : assessment ? "Enregistrer" : "Créer l’évaluation"}
          </Button>
        </div>
      )}
    </form>
  );
}
