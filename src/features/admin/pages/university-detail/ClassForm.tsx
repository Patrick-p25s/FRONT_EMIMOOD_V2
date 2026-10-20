// pages/university-detail/ClassForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { AcademicYear, Classe } from "../../api/types";
import { useClassMutations } from "../../hooks/useClassMutations";
import { classSchema, type ClassFormValues } from "./classSchema";

type ClassFormProps = {
  universityId: string;
  years: AcademicYear[];
  defaultYearId?: string | undefined;
  classe?: Classe | undefined;
  onDone: () => void;
  /** Reçoit le code d'invitation renvoyé une seule fois à la création. */
  onCreated: (invitationCode: string) => void;
};

const FIELDS = ["academic_year_id", "mention", "level", "name", "code", "description"];

export function ClassForm({
  universityId,
  years,
  defaultYearId,
  classe,
  onDone,
  onCreated,
}: ClassFormProps) {
  const { create, update } = useClassMutations();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      academic_year_id: classe?.academic_year_id ?? defaultYearId ?? "",
      mention: classe?.mention ?? "",
      level: classe?.level ?? "",
      name: classe?.name ?? "",
      code: classe?.code ?? "",
      description: classe?.description ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (classe) {
        await update.mutateAsync({
          id: classe.id,
          body: { name: values.name, description: values.description || null },
        });
        onDone();
      } else {
        const created = await create.mutateAsync({
          university_id: universityId,
          academic_year_id: values.academic_year_id,
          mention: values.mention,
          level: values.level,
          name: values.name,
          code: values.code,
          ...(values.description ? { description: values.description } : {}),
        });
        onCreated(created.code_invitation);
      }
    } catch (error) {
      applyServerErrors(error, setError, FIELDS);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />

      {!classe && (
        <>
          <Field id="class-year" label="Année académique" error={errors.academic_year_id?.message}>
            <select
              id="class-year"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              {...register("academic_year_id")}
            >
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                  {year.is_current ? " (courante)" : ""}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="class-mention"
              label="Mention"
              error={errors.mention?.message}
              hint="Ex. Informatique"
            >
              <Input
                id="class-mention"
                autoComplete="off"
                aria-invalid={!!errors.mention}
                {...register("mention")}
              />
            </Field>
            <Field id="class-level" label="Niveau" error={errors.level?.message} hint="Ex. L1">
              <Input
                id="class-level"
                autoComplete="off"
                aria-invalid={!!errors.level}
                {...register("level")}
              />
            </Field>
          </div>

          <Field
            id="class-code"
            label="Code de la classe"
            error={errors.code?.message}
            hint="Identifiant court et unique, ex. L1-INFO."
          >
            <Input
              id="class-code"
              autoComplete="off"
              aria-invalid={!!errors.code}
              {...register("code")}
            />
          </Field>
        </>
      )}

      <Field id="class-name" label="Nom" error={errors.name?.message}>
        <Input
          id="class-name"
          autoComplete="off"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <Field id="class-description" label="Description" error={errors.description?.message}>
        <Textarea
          id="class-description"
          rows={3}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </Field>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : classe ? "Enregistrer" : "Créer la classe"}
        </Button>
      </div>
    </form>
  );
}
