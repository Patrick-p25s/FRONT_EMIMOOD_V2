import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import { resourceSchema, type ResourceFormValues } from "../../lib/courseSchemas";
import type { CourseResource, ResourceType } from "@/features/course-ressources/api/schemas";
import { useCourseResourceMutations } from "@/features/course-ressources/hooks/useCourseRessources";

const SELECT = "h-9 w-full rounded-md border bg-background px-3 text-sm";

// NOUVEAU : « ressource » ne sert plus qu'aux liens
const LINK_TYPES: { value: ResourceType; label: string }[] = [
  { value: "link", label: "Lien" },
  { value: "video", label: "Vidéo" },
  { value: "other", label: "Autre" },
];

type ResourceFormProps = {
  chapterId: string;
  resource?: CourseResource | undefined;
  onDone: () => void;
};

export function ResourceForm({ chapterId, resource, onDone }: ResourceFormProps) {
  const { create, update } = useCourseResourceMutations();
  // NOUVEAU : une ancienne ressource déjà typée « document » garde son type visible à la modification
  const types: { value: ResourceType; label: string }[] =
    resource?.resource_type === "document"
      ? [...LINK_TYPES, { value: "document", label: "Document en ligne" }]
      : LINK_TYPES;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: resource?.title ?? "",
      resource_type: resource?.resource_type ?? "link", // NOUVEAU : « link » par défaut
      url: resource?.url ?? "",
      description: resource?.description ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (resource) {
        await update.mutateAsync({
          id: resource.id,
          input: {
            title: values.title,
            resource_type: values.resource_type,
            url: values.url,
            description: values.description || null,
          },
        });
      } else {
        await create.mutateAsync({
          chapter_id: chapterId,
          title: values.title,
          resource_type: values.resource_type,
          url: values.url,
          ...(values.description ? { description: values.description } : {}),
        });
      }
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, ["title", "resource_type", "url", "description"]);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />

      <Field id="res-title" label="Titre" error={errors.title?.message}>
        <Input
          id="res-title"
          autoComplete="off"
          aria-invalid={!!errors.title}
          {...register("title")}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
        <Field id="res-type" label="Type" error={errors.resource_type?.message}>
          <select id="res-type" className={SELECT} {...register("resource_type")}>
            {types.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="res-url"
          label="Adresse (lien)"
          error={errors.url?.message}
          hint="Commence par https://"
        >
          <Input
            id="res-url"
            type="url"
            inputMode="url"
            placeholder="https://…"
            aria-invalid={!!errors.url}
            {...register("url")}
          />
        </Field>
      </div>

      <Field
        id="res-description"
        label="Description"
        error={errors.description?.message}
        hint="Facultatif."
      >
        <Textarea
          id="res-description"
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
          {isSubmitting ? "Enregistrement…" : resource ? "Enregistrer" : "Ajouter la ressource"}
        </Button>
      </div>
    </form>
  );
}
