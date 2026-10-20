// pages/subjects/SubjectForm.tsx : création et modification (nom et description seulement)
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { TeacherSubject } from "../../api/types";
import { useAvailableClasses } from "../../hooks/useAvailableClasses";
import { useSubjectMutations } from "../../hooks/useSubjectMutations";
import { ClassPicker } from "./ClassPicker";
import { subjectSchema, type SubjectFormValues } from "./subjectSchema";

const SELECT = "h-9 w-full rounded-md border bg-background px-3 text-sm";
const SEMESTERS = Array.from({ length: 12 }, (_, index) => index + 1);
const FIELDS = ["name", "code", "description", "semester", "classe_ids"];

type SubjectFormProps = { subject?: TeacherSubject | undefined; onDone: () => void };

export function SubjectForm({ subject, onDone }: SubjectFormProps) {
  const { create, update } = useSubjectMutations();
  const classes = useAvailableClasses(!subject);
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: subject?.name ?? "",
      code: subject?.code ?? "",
      description: subject?.description ?? "",
      semester: "",
      classe_ids: [],
    },
  });

  const selected = watch("classe_ids");
  const toggle = (id: string) =>
    setValue(
      "classe_ids",
      selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id],
      { shouldDirty: true },
    );

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (subject) {
        await update.mutateAsync({
          id: subject.id,
          input: { name: values.name, description: values.description || null },
        });
      } else {
        await create.mutateAsync({
          name: values.name,
          ...(values.code ? { code: values.code } : {}),
          ...(values.description ? { description: values.description } : {}),
          classe_ids: values.classe_ids,
          ...(values.semester ? { semester: Number(values.semester) } : {}),
        });
      }
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, FIELDS);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />

      <Field id="subject-name" label="Nom" error={errors.name?.message}>
        <Input
          id="subject-name"
          autoComplete="off"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      {!subject && (
        <Field
          id="subject-code"
          label="Code"
          error={errors.code?.message}
          hint="Facultatif. Ex. BDD."
        >
          <Input
            id="subject-code"
            autoComplete="off"
            aria-invalid={!!errors.code}
            {...register("code")}
          />
        </Field>
      )}

      <Field id="subject-description" label="Description" error={errors.description?.message}>
        <Textarea
          id="subject-description"
          rows={3}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </Field>

      {!subject && (
        <>
          <Field
            id="subject-semester"
            label="Semestre"
            error={errors.semester?.message}
            hint="Facultatif. Le même pour toutes les classes cochées."
          >
            <select id="subject-semester" className={SELECT} {...register("semester")}>
              <option value="">—</option>
              {SEMESTERS.map((value) => (
                <option key={value} value={value}>
                  Semestre {value}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id="subject-classes"
            label="Classes"
            error={errors.classe_ids?.message}
            hint="Facultatif : vous pourrez en ajouter plus tard."
          >
            <ClassPicker
              options={classes.data ?? []}
              selected={selected}
              onToggle={toggle}
              loading={classes.isLoading}
              error={classes.error}
              onRetry={() => void classes.refetch()}
              emptyText="Aucune classe active disponible dans votre université."
            />
          </Field>
        </>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : subject ? "Enregistrer" : "Créer la matière"}
        </Button>
      </div>
    </form>
  );
}
