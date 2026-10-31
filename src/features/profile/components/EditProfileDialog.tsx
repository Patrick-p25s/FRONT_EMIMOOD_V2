// features/profile/components/EditProfileDialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { applyServerErrors } from "@/lib/errors";
import type { Account, UpdateAccountInput } from "../api/schemas";
import { ALLOWED_AVATAR_TYPES, MAX_AVATAR_BYTES } from "../lib/avatar";
import { profileFormSchema, type ProfileFormValues } from "../lib/schemas";
import { UserAvatar } from "./UserAvatar";
import { useAccount, useProfileMutations } from "../hooks/useProfile";

function AvatarControls({ name, url }: { name: string; url: string | null }) {
  const { upload, removeAvatar } = useProfileMutations();
  const [error, setError] = useState<string | null>(null);

  const pick = (file: File | undefined) => {
    if (!file) return;
    // Contrôle de confort : le serveur revérifie le contenu réel du fichier.
    if (!ALLOWED_AVATAR_TYPES.includes(file.type))
      return setError("Format non autorisé (JPEG, PNG ou WebP).");
    if (file.size > MAX_AVATAR_BYTES) return setError("Image trop volumineuse (2 Mo maximum).");
    setError(null);
    upload.mutate(file);
  };

  return (
    <div className="flex items-center gap-4">
      <UserAvatar name={name} url={url} className="size-16 text-lg" />
      <div className="grid gap-1">
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" asChild disabled={upload.isPending}>
            <label className="cursor-pointer">
              {upload.isPending ? "Envoi…" : "Changer la photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  pick(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </label>
          </Button>
          {url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={removeAvatar.isPending}
              onClick={() => removeAvatar.mutate()}
            >
              Retirer
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">JPEG, PNG ou WebP · 2 Mo maximum</p>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function EditProfileForm({ account, onDone }: { account: Account; onDone: () => void }) {
  const { update } = useProfileMutations();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: account.first_name,
      last_name: account.last_name,
      phone_number: account.phone_number ?? "",
      bio: account.bio ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    // On n'envoie que ce qui a changé.
    const input: UpdateAccountInput = {
      ...(values.first_name !== account.first_name ? { first_name: values.first_name } : {}),
      ...(values.last_name !== account.last_name ? { last_name: values.last_name } : {}),
      ...(values.phone_number !== (account.phone_number ?? "")
        ? { phone_number: values.phone_number }
        : {}),
      ...(values.bio !== (account.bio ?? "") ? { bio: values.bio } : {}),
    };
    if (Object.keys(input).length === 0) return onDone();
    try {
      await update.mutateAsync(input);
      onDone();
    } catch (error) {
      applyServerErrors(error, setError, ["first_name", "last_name", "phone_number", "bio"]);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <AvatarControls
        name={`${account.first_name} ${account.last_name}`}
        url={account.avatar_url}
      />
      <FormError message={errors.root?.message} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="pf-first" label="Prénom" error={errors.first_name?.message}>
          <Input
            id="pf-first"
            autoComplete="given-name"
            aria-invalid={!!errors.first_name}
            {...register("first_name")}
          />
        </Field>
        <Field id="pf-last" label="Nom" error={errors.last_name?.message}>
          <Input
            id="pf-last"
            autoComplete="family-name"
            aria-invalid={!!errors.last_name}
            {...register("last_name")}
          />
        </Field>
      </div>

      <Field
        id="pf-phone"
        label="Téléphone"
        error={errors.phone_number?.message}
        hint="Privé : visible par vous seul."
      >
        <Input
          id="pf-phone"
          type="tel"
          autoComplete="tel"
          aria-invalid={!!errors.phone_number}
          {...register("phone_number")}
        />
      </Field>

      <Field
        id="pf-bio"
        label="Présentation"
        error={errors.bio?.message}
        hint="Visible par les membres de votre université."
      >
        <Textarea id="pf-bio" rows={5} aria-invalid={!!errors.bio} {...register("bio")} />
      </Field>

      <p className="text-xs text-muted-foreground">
        L’email, la classe et le rôle sont gérés par l’administration.
      </p>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}

export function EditProfileDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const account = useAccount();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier mon profil</DialogTitle>
        </DialogHeader>
        {account.error ? (
          <ErrorState error={account.error} onRetry={() => void account.refetch()} />
        ) : !account.data ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <EditProfileForm
            key={account.data.id}
            account={account.data}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
