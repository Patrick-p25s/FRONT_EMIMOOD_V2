import { useForm } from "react-hook-form";
import { AcademicYear } from "../../api/types";
import { useAccademicYearMutations } from "../../hooks/useAccademicYearMutations";
import { accademicYearSchema, type AccademicYearValues } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { id } from "zod/v4/locales";
import { applyServerErrors } from "@/lib/errors";

type AcademicYearFormProps = { academicYear: AcademicYear | undefined; onDone: () => void };
export function AcademicYearForm({ academicYear, onDone }: AcademicYearFormProps) {
  const { create, update } = useAccademicYearMutations();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AccademicYearValues>({
    resolver: zodResolver(accademicYearSchema),
    defaultValues: {
      name: academicYear?.name ?? "",
      start_date: academicYear?.start_date ?? "",
      end_date: academicYear?.end_date ?? "",
    },
  });
  const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    try {
      if (academicYear) {
        await update.mutateAsync({
          id: academicYear.id,
          body: { name: values.name, start_date: values.start_date, end_date: values.end_date },
        });
      } else {
        await create.mutateAsync({
          name: values.name,
          start_date: values.start_date,
          end_date: values.end_date,
        });
      }
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, ["name", "start_date", "end_date"]);
    }
  });
  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />
      <Field id="uni-name" label="Nom" error={errors.name?.message}>
        <Input
          id="uni-name"
          autoCapitalize="off"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <Field id="year-start" label="Comencé le " error={errors.start_date?.message}>
        <Input
          id="year-start"
          type="date"
          aria-invalid={!!errors.start_date}
          {...register("start_date")}
        />
      </Field>

      <Field id="year-end" label="jusqu'à" error={errors.end_date?.message}>
        <Input
          id="year-end"
          type="date"
          aria-invalid={!!errors.end_date}
          {...register("end_date")}
        />
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : "Créer l’université"}
        </Button>
      </div>
    </form>
  );
}
