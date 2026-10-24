// features/profile/components/ChangePasswordForm.tsx : à placer dans votre page « Paramètres »
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { endSession } from "@/lib/api/client";
import { passwordFormSchema, type PasswordFormValues } from "../lib/schemas";
import { useProfileMutations } from "../hoooks/useProfile";
import { messageOf } from "@/lib/api/message";

export function ChangePasswordForm() {
  const { changePassword } = useProfileMutations();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { current_password: "", new_password: "", confirm: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePassword.mutateAsync({
        current_password: values.current_password,
        new_password: values.new_password,
      });
    } catch (error) {
      setError("root", { message: messageOf(error) });
      return;
    }
    // Toutes les sessions sont révoquées par le serveur : il faut se reconnecter.
    toast.success("Mot de passe modifié. Reconnectez-vous avec le nouveau.");
    endSession({ kind: "logout" });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid max-w-md gap-4">
      <FormError message={errors.root?.message} />
      <Field id="pw-current" label="Mot de passe actuel" error={errors.current_password?.message}>
        <Input
          id="pw-current"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.current_password}
          {...register("current_password")}
        />
      </Field>
      <Field
        id="pw-new"
        label="Nouveau mot de passe"
        error={errors.new_password?.message}
        hint="8 à 128 caractères."
      >
        <Input
          id="pw-new"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.new_password}
          {...register("new_password")}
        />
      </Field>
      <Field
        id="pw-confirm"
        label="Confirmer le nouveau mot de passe"
        error={errors.confirm?.message}
      >
        <Input
          id="pw-confirm"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirm}
          {...register("confirm")}
        />
      </Field>
      <p className="text-xs text-muted-foreground">
        Après le changement, vous serez déconnecté de tous vos appareils.
      </p>
      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Modification…" : "Changer le mot de passe"}
        </Button>
      </div>
    </form>
  );
}
