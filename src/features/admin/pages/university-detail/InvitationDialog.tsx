// pages/university-detail/InvitationDialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { OnceSecretDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { applyServerErrors } from "@/lib/errors";
import type { CreateInvitationCodeInput } from "../../api/invitationCodes";
import type { InvitationCode } from "../../api/types";
import { invitationSchema, type InvitationFormValues } from "./invitationSchema";
import { useInvitationCodes, useInvitationMutations } from "../../hooks/useInvitationCodes";

type Role = CreateInvitationCodeInput["role"];
export const ROLE_LABEL: Record<Role, string> = { teacher: "Enseignant", moderator: "Modérateur" };

type FormProps = {
  universityId: string;
  role?: Role | undefined;
  onCancel: () => void;
  onCreated: (code: InvitationCode) => void;
};

function InvitationForm({ universityId, role, onCancel, onCreated }: FormProps) {
  const { create } = useInvitationMutations();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: { role: role ?? "teacher", max_uses: "", expires_at: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const created = await create.mutateAsync({
        university_id: universityId,
        role: values.role,
        ...(values.max_uses ? { max_uses: Number(values.max_uses) } : {}),
        ...(values.expires_at
          ? { expires_at: new Date(`${values.expires_at}T23:59:59`).toISOString() }
          : {}),
      });
      onCreated(created);
    } catch (error) {
      applyServerErrors(error, setError, ["role", "max_uses", "expires_at"]);
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <FormError message={errors.root?.message} />

      {role ? (
        <p className="text-sm">
          Rôle : <strong>{ROLE_LABEL[role]}</strong>
          <input type="hidden" {...register("role")} />
        </p>
      ) : (
        <Field id="code-role" label="Rôle" error={errors.role?.message}>
          <select
            id="code-role"
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            {...register("role")}
          >
            <option value="teacher">{ROLE_LABEL.teacher}</option>
            <option value="moderator">{ROLE_LABEL.moderator}</option>
          </select>
        </Field>
      )}

      <Field
        id="code-max"
        label="Nombre d’utilisations"
        error={errors.max_uses?.message}
        hint="Facultatif. Vide = illimité."
      >
        <Input
          id="code-max"
          inputMode="numeric"
          aria-invalid={!!errors.max_uses}
          {...register("max_uses")}
        />
      </Field>

      <Field
        id="code-exp"
        label="Valable jusqu’au"
        error={errors.expires_at?.message}
        hint="Facultatif. Vide = sans expiration."
      >
        <Input
          id="code-exp"
          type="date"
          aria-invalid={!!errors.expires_at}
          {...register("expires_at")}
        />
      </Field>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Création…" : "Générer le code"}
        </Button>
      </div>
    </form>
  );
}

type DialogProps = {
  universityId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Fixé : le rôle n'est plus proposé (ex. « Inviter un enseignant »). */
  role?: Role | undefined;
  title: string;
};

export function InvitationDialog({ universityId, open, onOpenChange, role, title }: DialogProps) {
  const [secret, setSecret] = useState<string | null>(null);
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Le code ne sera affiché qu’une seule fois.</DialogDescription>
          </DialogHeader>
          <InvitationForm
            universityId={universityId}
            role={role}
            onCancel={() => onOpenChange(false)}
            onCreated={(created) => {
              onOpenChange(false);
              setSecret(created.code);
            }}
          />
        </DialogContent>
      </Dialog>
      <OnceSecretDialog
        secret={secret}
        title="Code d’invitation créé"
        onClose={() => setSecret(null)}
      />
    </>
  );
}
