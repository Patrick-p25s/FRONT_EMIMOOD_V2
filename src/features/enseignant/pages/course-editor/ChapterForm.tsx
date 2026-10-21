import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { Chapter } from "../../api/types";
import { capabilities } from "../../capabilities";
import { useChapterMutations } from "../../hooks/useCourseMutations";
import { chapterSchema, type ChapterFormValues } from "../../lib/courseSchemas";

type ChapterFormProps = { courseId: string; chapter?: Chapter | undefined; onDone: () => void };

/** Les textes existants, un champ chacun ; sinon un champ vide pour commencer. */
const initialTexts = (chapter?: Chapter) =>
  chapter?.content && chapter.content.length > 0
    ? chapter.content.map((block) => ({ value: block.content }))
    : [{ value: "" }];

export function ChapterForm({ courseId, chapter, onDone }: ChapterFormProps) {
  const { create, update } = useChapterMutations();
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: chapter?.title ?? "",
      description: chapter?.description ?? "",
      content: initialTexts(chapter),
    },
  });
  const { fields, append, remove, move } = useFieldArray({ control, name: "content" });

  const onSubmit = handleSubmit(async (values) => {
    // Les champs vides ne sont pas envoyés.
    const content = values.content.map((item) => item.value.trim()).filter(Boolean);
    try {
      if (chapter) {
        await update.mutateAsync({
          id: chapter.id,
          input: {
            title: values.title,
            description: values.description || null,
            // Remplace toute la liste côté serveur (liste vide = textes effacés).
            ...(capabilities.chapterText ? { content } : {}),
          },
        });
      } else {
        await create.mutateAsync({
          course_id: courseId,
          title: values.title,
          ...(values.description ? { description: values.description } : {}),
          ...(capabilities.chapterText && content.length > 0 ? { content } : {}),
        });
      }
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, ["title", "description", "content"]);
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
          rows={2}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </Field>

      {/* Les textes d'explication : un petit champ chacun, autant qu'on veut */}
      {capabilities.chapterText && (
        <fieldset className="grid gap-2">
          <legend className="mb-1 text-sm font-medium">Textes d’explication</legend>
          <p className="text-xs text-muted-foreground">
            Un petit texte par champ. Ajoutez-en autant que nécessaire.
          </p>

          <div className="grid max-h-64 gap-2 overflow-y-auto pr-1">
            {fields.map((field, index) => {
              const message = errors.content?.[index]?.value?.message;
              return (
                <div key={field.id} className="grid gap-1">
                  <div className="flex items-start gap-1">
                    <Textarea
                      rows={2}
                      aria-label={`Texte ${index + 1}`}
                      aria-invalid={!!message}
                      className="min-h-0 resize-none"
                      {...register(`content.${index}.value` as const)}
                    />
                    <div className="flex shrink-0">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        disabled={index === 0}
                        aria-label={`Monter le texte ${index + 1}`}
                        onClick={() => move(index, index - 1)}
                      >
                        <ArrowUp className="size-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        disabled={index === fields.length - 1}
                        aria-label={`Descendre le texte ${index + 1}`}
                        onClick={() => move(index, index + 1)}
                      >
                        <ArrowDown className="size-4" aria-hidden />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        aria-label={`Retirer le texte ${index + 1}`}
                        onClick={() => remove(index)}
                      >
                        <X className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </div>
                  {message && (
                    <p role="alert" className="text-xs text-destructive">
                      {message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {(errors.content?.root?.message ?? errors.content?.message) && (
            <p role="alert" className="text-xs text-destructive">
              {errors.content?.root?.message ?? errors.content?.message}
            </p>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-fit text-primary"
            onClick={() => append({ value: "" })}
          >
            <Plus className="size-4" aria-hidden /> Ajouter un texte
          </Button>
        </fieldset>
      )}

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
