// components/PublicationForm.tsx : publier, et modifier (titre, texte, date et lieu seulement)
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { Publication, PublicationType } from "../api/types";
import { usePublicationMutations } from "../hooks/usePublicationMutations";
import { fromLocalInput, toLocalInput } from "../lib/dates";
import { PUB_TYPES } from "../lib/meta";
import { publicationSchema, type PublicationFormValues } from "../lib/schema";
import { useState } from "react";
import { MAX_FILE_BYTES, MAX_FILE_MB } from "@/lib/files";

const SELECT = "h-9 w-full rounded-md border bg-background px-3 text-sm";
const FIELDS = [
  "publication_type",
  "visibility",
  "classe_id",
  "subject_id",
  "title",
  "content",
  "link_url",
  "event_at",
  "event_location",
];

export type ClassOption = { id: string; name: string };
export type SubjectOption = { id: string; name: string };

type PublicationFormProps = {
  classes: ClassOption[];
  subjects: SubjectOption[];
  publication?: Publication | undefined;
  initialType?: PublicationType | undefined;
  onDone: () => void;
};

// signature
export function PublicationForm({
  classes,
  subjects,
  publication,
  initialType,
  onDone,
}: PublicationFormProps) {
  const { create, update, createWithFile } = usePublicationMutations();
  const editing = !!publication;
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PublicationFormValues>({
    resolver: zodResolver(publicationSchema),
    defaultValues: {
      publication_type: publication?.publication_type ?? initialType ?? "announcement",
      visibility: publication?.visibility ?? (classes.length > 0 ? "class" : "university"),
      classe_id: publication?.classe_id ?? classes[0]?.id ?? "",
      subject_id: "",
      title: publication?.title ?? "",
      content: publication?.content ?? "",
      link_url: "",
      event_at: toLocalInput(publication?.event_at),
      event_location: publication?.event_location ?? "",
    },
  });

  const type = watch("publication_type");
  const visibility = watch("visibility");

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (publication) {
        await update.mutateAsync({
          id: publication.id,
          input: {
            ...(values.title ? { title: values.title } : {}),
            content: values.content,
            ...(publication.publication_type === "event"
              ? {
                  event_at: fromLocalInput(values.event_at),
                  ...(values.event_location ? { event_location: values.event_location } : {}),
                }
              : {}),
          },
        });
      } else if (file && values.publication_type === "resource") {
        // Avec un fichier, le serveur exige un titre.
        if (!values.title) {
          setError("title", { message: "Le titre est obligatoire avec un fichier" });
          return;
        }
        await createWithFile.mutateAsync({
          file,
          title: values.title,
          content: values.content,
          visibility: values.visibility,
          ...(values.visibility === "class" ? { classe_id: values.classe_id } : {}),
          ...(values.subject_id ? { subject_id: values.subject_id } : {}),
        });
      } else {
        await create.mutateAsync({
          publication_type: values.publication_type,
          visibility: values.visibility,
          ...(values.visibility === "class" ? { classe_id: values.classe_id } : {}),
          ...(values.title ? { title: values.title } : {}),
          content: values.content,
          ...(values.link_url ? { link_url: values.link_url } : {}),
          ...(values.subject_id ? { subject_id: values.subject_id } : {}),
          ...(values.publication_type === "event"
            ? {
                event_at: fromLocalInput(values.event_at),
                ...(values.event_location ? { event_location: values.event_location } : {}),
              }
            : {}),
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

      {!editing && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pub-type" label="Type" error={errors.publication_type?.message}>
            <select id="pub-type" className={SELECT} {...register("publication_type")}>
              {Object.entries(PUB_TYPES).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="pub-visibility" label="Visible par" error={errors.visibility?.message}>
            <select id="pub-visibility" className={SELECT} {...register("visibility")}>
              <option value="class" disabled={classes.length === 0}>
                Une classe
              </option>
              <option value="university">Toute l’université</option>
            </select>
          </Field>
        </div>
      )}

      {!editing && visibility === "class" && (
        <Field id="pub-class" label="Classe" error={errors.classe_id?.message}>
          <select id="pub-class" className={SELECT} {...register("classe_id")}>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field id="pub-title" label="Titre" error={errors.title?.message} hint="Facultatif.">
        <Input
          id="pub-title"
          autoComplete="off"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
      </Field>

      <Field id="pub-content" label="Message" error={errors.content?.message}>
        <Textarea
          id="pub-content"
          rows={5}
          aria-invalid={!!errors.content}
          {...register("content")}
        />
      </Field>

      {(editing ? publication.publication_type === "event" : type === "event") && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="pub-event-at" label="Date et heure" error={errors.event_at?.message}>
            <Input
              id="pub-event-at"
              type="datetime-local"
              aria-invalid={!!errors.event_at}
              {...register("event_at")}
            />
          </Field>
          <Field
            id="pub-event-place"
            label="Lieu"
            error={errors.event_location?.message}
            hint="Facultatif."
          >
            <Input id="pub-event-place" autoComplete="off" {...register("event_location")} />
          </Field>
        </div>
      )}

      {!editing && (
        <>
          <Field
            id="pub-link"
            label="Lien"
            error={errors.link_url?.message}
            hint="Facultatif : page, vidéo, document en ligne…"
          >
            <Input
              disabled={!!file}
              id="pub-link"
              inputMode="url"
              placeholder="https://"
              aria-invalid={!!errors.link_url}
              {...register("link_url")}
            />
          </Field>
          {type === "resource" && subjects.length > 0 && (
            <Field
              id="pub-subject"
              label="Matière"
              error={errors.subject_id?.message}
              hint="Facultatif."
            >
              <select id="pub-subject" className={SELECT} {...register("subject_id")}>
                <option value="">—</option>
                {subjects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </>
      )}

      {type === "resource" && (
        <Field
          id="pub-file"
          label="Fichier"
          hint={`Facultatif, à la place du lien. ${MAX_FILE_MB} Mo maximum.`}
          error={fileError ?? undefined}
        >
          <Input
            id="pub-file"
            type="file"
            onChange={(event) => {
              const picked = event.target.files?.[0] ?? null;
              if (picked && picked.size > MAX_FILE_BYTES) {
                event.target.value = "";
                setFile(null);
                setFileError(`Fichier trop lourd (${MAX_FILE_MB} Mo maximum)`);
                return;
              }
              setFileError(null);
              setFile(picked);
            }}
          />
        </Field>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : editing ? "Enregistrer" : "Publier"}
        </Button>
      </div>
    </form>
  );
}
