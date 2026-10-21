// pages/subject-detail/CourseForm.tsx : création ET modification (dans l'éditeur)
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { Course } from "../../api/types";
import { useCourseMutations } from "../../hooks/useCourseMutations";
import { courseSchema, type CourseFormValues } from "../../lib/courseSchemas";

type CourseFormProps = {
  classSubjectId?: string | undefined;
  course?: Course | undefined;
  onCancel?: (() => void) | undefined;
  onSaved: (course: Course) => void;
};

export function CourseForm({ classSubjectId, course, onCancel, onSaved }: CourseFormProps) {
  const { create, update } = useCourseMutations();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: { title: course?.title ?? "", description: course?.description ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const saved = course
        ? await update.mutateAsync({
            id: course.id,
            input: { title: values.title, description: values.description || null },
          })
        : await create.mutateAsync({
            class_subject_id: classSubjectId ?? "",
            title: values.title,
            ...(values.description ? { description: values.description } : {}),
          });
      reset(values);
      onSaved(saved as Course);
    } catch (error) {
      applyServerErrors(error, setError, ["title", "description"]);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />
      <Field id="course-title" label="Titre" error={errors.title?.message}>
        <Input
          id="course-title"
          autoComplete="off"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
      </Field>
      <Field id="course-description" label="Description" error={errors.description?.message}>
        <Textarea
          id="course-description"
          rows={3}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </Field>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || (!!course && !isDirty)}>
          {isSubmitting ? "Enregistrement…" : course ? "Enregistrer" : "Créer le cours"}
        </Button>
      </div>
    </form>
  );
}
