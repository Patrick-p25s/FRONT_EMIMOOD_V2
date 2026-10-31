import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ArrowRight, KeyRound, Mail, Phone, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { Brand } from "@/components/emimood/atoms/Brand";
import { FormError } from "@/components/emimood/molecules/form";
import { pageHead } from "@/components/emimood/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schema";
import { safeNext } from "@/lib/api/list";
import { useAuth, roleHome } from "@/lib/auth";
import { applyServerErrors } from "@/lib/errors";
import { AuthInput, AuthLayout } from "./connexion";

type RegisterSearch = { next?: string | undefined };
export const Route = createFileRoute("/register")({
  head: () => pageHead("Créer un compte", "Créez votre compte EMIMood."),
  validateSearch: (s: Record<string, unknown>): RegisterSearch => ({
    next: typeof s["next"] === "string" ? s["next"] : undefined,
  }),
  component: RegisterPage,
});
function RegisterPage() {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      password: "",
      invitation_code: "",
    },
  });
  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await createAccount(values);
      const next = safeNext(search.next);
      const target = safeNext(next);
      if (target) router.history.replace(target);
      else void navigate({ to: roleHome[user.role], replace: true });
    } catch (error) {
      applyServerErrors(error, setError, [
        "first_name",
        "last_name",
        "phone_number",
        "email",
        "password",
        "invitation_code",
      ]);
    }
  });
  const field = (
    name: keyof RegisterFormValues,
    label: string,
    icon: ReactNode,
    type = "text",
    autoComplete?: string,
  ) => (
    <AuthInput id={`register-${name}`} label={label} error={errors[name]?.message} icon={icon}>
      <Input
        id={`register-${name}`}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={!!errors[name]}
        {...register(name)}
      />
    </AuthInput>
  );
  return (
    <AuthLayout
      eyebrow="Bienvenue sur EMIMood"
      title="Commencez votre parcours connecté."
      description="Votre code d’invitation lie votre compte à votre université."
    >
      <Brand link="/" />
      <div className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight">Créer mon compte</h1>
        <p className="mt-2 text-muted-foreground">Rejoignez votre espace universitaire.</p>
      </div>
      <form onSubmit={onSubmit} noValidate className="mt-7 grid gap-5">
        <FormError message={errors.root?.message} />
        <div className="grid gap-5 sm:grid-cols-2">
          {field("first_name", "Prénom", <UserRound />, "text", "given-name")}
          {field("last_name", "Nom", <UserRound />, "text", "family-name")}
        </div>
        {field("phone_number", "Téléphone", <Phone />, "tel", "tel")}
        {field("email", "Adresse email", <Mail />, "email", "email")}
        {field("password", "Mot de passe", <KeyRound />, "password", "new-password")}
        {field("invitation_code", "Code d’invitation", <KeyRound />, "text", "off")}
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            "Création…"
          ) : (
            <>
              Créer mon compte <ArrowRight />
            </>
          )}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link to="/connexion" className="font-semibold text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  );
}
