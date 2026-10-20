// pages/universities/UniversityForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { University } from "../../api/types";
import { useUniversityMutations } from "../../hooks/useUniversityMutations";
import { universitySchema, type UniversityFormValues } from "./schema";

type UniversityFormProps = { university?: University | undefined; onDone: () => void };

export function UniversityForm({ university, onDone }: UniversityFormProps) {
  const { create, update } = useUniversityMutations();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UniversityFormValues>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      name: university?.name ?? "",
      code: university?.code ?? "",
      description: university?.description ?? "",
      logo_url: university?.logo_url ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (university) {
        await update.mutateAsync({
          id: university.id,
          body: {
            name: values.name,
            description: values.description || null,
            logo_url: values.logo_url || null,
          },
        });
      } else {
        await create.mutateAsync({
          name: values.name,
          code: values.code,
          ...(values.description ? { description: values.description } : {}),
          ...(values.logo_url ? { logo_url: values.logo_url } : {}),
        });
      }
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, ["name", "code", "description", "logo_url"]);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />

      <Field id="uni-name" label="Nom" error={errors.name?.message}>
        <Input
          id="uni-name"
          autoComplete="off"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <Field
        id="uni-code"
        label="Code"
        error={errors.code?.message}
        hint={
          university
            ? "Le code ne peut pas être modifié."
            : "Identifiant court et unique, par exemple EMIT."
        }
      >
        <Input
          id="uni-code"
          autoComplete="off"
          disabled={!!university}
          aria-invalid={!!errors.code}
          {...register("code")}
        />
      </Field>

      <Field id="uni-description" label="Description" error={errors.description?.message}>
        <Textarea
          id="uni-description"
          rows={3}
          aria-invalid={!!errors.description}
          {...register("description")}
        />
      </Field>

      <Field
        id="uni-logo"
        label="Logo (lien)"
        error={errors.logo_url?.message}
        hint="Facultatif. Lien https:// vers une image."
      >
        <Input
          id="uni-logo"
          type="url"
          inputMode="url"
          placeholder="https://…"
          aria-invalid={!!errors.logo_url}
          {...register("logo_url")}
        />
      </Field>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : university ? "Enregistrer" : "Créer l’université"}
        </Button>
      </div>
    </form>
  );
}
