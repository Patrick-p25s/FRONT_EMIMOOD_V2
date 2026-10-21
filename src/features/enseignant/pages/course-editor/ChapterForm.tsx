// pages/course-editor/ChapterForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { Chapter } from "../../api/types";
import { useChapterMutations } from "../../hooks/useCourseMutations";
import { chapterSchema, type CourseFormValues } from "../../lib/courseSchemas";

type ChapterFormProps = { courseId: string; chapter?: Chapter | undefined; onDone: () => void };

export function ChapterForm({ courseId, chapter, onDone }: ChapterFormProps) {
  const { create, update } = useChapterMutations();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: { title: chapter?.title ?? "", description: chapter?.description ?? "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (chapter) {
        await update.mutateAsync({
          id: chapter.id,
          input: { title: values.title, description: values.description || null },
        });
      } else {
        await create.mutateAsync({
          course_id: courseId,
          title: values.title,
          ...(values.description ? { description: values.description } : {}),
        });
      }
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, ["title", "description"]);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />
      <Field id="chapter-title" label="Titre du chapitre" error={errors.title?.message}>
        <Input
          id="chapter-title"
          autoComplete="off"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
      </Field>
      <Field
        id="chapter-description"
        label="Description"
        error={errors.description?.message}
        hint="Facultatif."
      >
        <Textarea
          id="chapter-description"
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
          {isSubmitting ? "Enregistrement…" : chapter ? "Enregistrer" : "Ajouter le chapitre"}
        </Button>
      </div>
    </form>
  );
}
