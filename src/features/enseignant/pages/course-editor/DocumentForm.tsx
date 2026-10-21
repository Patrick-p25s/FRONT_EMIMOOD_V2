import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { ChapterDocument } from "../../api/types";
import { useDocumentMutations } from "../../hooks/useCourseMutations";
import { documentSchema, type DocumentFormValues } from "../../lib/courseSchemas";
import {
  ACCEPT_ATTRIBUTE,
  MAX_DOCUMENT_MB,
  formatSize,
  validateFile,
} from "../../lib/documentRules";

type DocumentFormProps = {
  chapterId: string;
  document?: ChapterDocument | undefined;
  onDone: () => void;
};

export function DocumentForm({ chapterId, document: existing, onDone }: DocumentFormProps) {
  const { upload, update } = useDocumentMutations();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { title: existing?.title ?? "", description: existing?.description ?? "" },
  });

  const onPick = (picked: File | undefined) => {
    if (!picked) return;
    const message = validateFile(picked);
    setFileError(message ?? undefined);
    setFile(message ? null : picked);
    // Propose le nom du fichier comme titre, sans écraser une saisie.
    if (!message && !getValues("title")) {
      setValue("title", picked.name.replace(/\.[^.]+$/, ""), { shouldValidate: true });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (existing) {
        await update.mutateAsync({
          id: existing.id,
          input: { title: values.title, description: values.description || null },
        });
      } else {
        if (!file) {
          setFileError("Choisissez un fichier.");
          return;
        }
        const form = new FormData();
        form.append("chapter_id", chapterId);
        form.append("title", values.title);
        if (values.description) form.append("description", values.description);
        form.append("file", file);
        await upload.mutateAsync(form);
      }
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, ["title", "description"]);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />

      {existing ? (
        <p className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
          {existing.file_name}{" "}
          <span className="text-muted-foreground">{formatSize(existing.file_size)}</span>
        </p>
      ) : (
        <Field
          id="doc-file"
          label="Fichier"
          error={fileError}
          hint={`PDF, Word, PowerPoint, Excel, images ou texte · ${MAX_DOCUMENT_MB} Mo maximum`}
        >
          <input
            id="doc-file"
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            onChange={(event) => onPick(event.target.files?.[0])}
            className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-primary/15"
          />
          {file && (
            <p className="mt-1 text-xs text-muted-foreground">
              {file.name} · {formatSize(file.size)}
            </p>
          )}
        </Field>
      )}

      <Field id="doc-title" label="Titre" error={errors.title?.message}>
        <Input
          id="doc-title"
          autoComplete="off"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
      </Field>

      <Field
        id="doc-description"
        label="Description"
        error={errors.description?.message}
        hint="Facultatif."
      >
        <Textarea
          id="doc-description"
          rows={2}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </Field>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi en cours…" : existing ? "Enregistrer" : "Téléverser"}
        </Button>
      </div>
    </form>
  );
}
