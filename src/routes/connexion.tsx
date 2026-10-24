import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, GraduationCap, LockKeyhole, Mail } from "lucide-react";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { Brand } from "@/components/emimood/atoms/Brand";
import { Field, FormError } from "@/components/emimood/molecules/form";
import { pageHead } from "@/components/emimood/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/features/auth/schema";
import { safeNext } from "@/lib/api/list";
import { useAuth, roleHome, roleLabels, isDemo, type Role } from "@/lib/auth";
import { applyServerErrors } from "@/lib/errors";

type LoginSearch = { next?: string | undefined; reason?: string | undefined };
export const Route = createFileRoute("/connexion")({
  head: () => pageHead("Connexion", "Connectez-vous à votre espace EMIMood."),
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    next: typeof s.next === "string" ? s.next : undefined,
    reason: typeof s.reason === "string" ? s.reason : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [role, setRole] = useState<Role>("student");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: isDemo ? "patrick@emit.mg" : "", password: isDemo ? "demo1234" : "" },
  });
  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await login(values.email, values.password, role);
      const next = safeNext(search.next);
      const admin =
        !!next && (next === "/admin" || next.startsWith("/admin/") || next.startsWith("/admin?"));
      navigate(
        next && (!admin || user.role === "super_admin")
          ? { href: next, replace: true }
          : { to: roleHome[user.role], replace: true },
      );
    } catch (error) {
      applyServerErrors(error, setError, ["email", "password"]);
    }
  });
  return (
    <AuthLayout
      eyebrow="EMIMood"
      title="Votre université, au rythme de vos ambitions."
      description="Cours, évaluations et vie étudiante réunis dans un seul espace."
    >
      <Brand link="/" />
      <div className="mt-9">
        <h1 className="text-3xl font-bold tracking-tight">Bon retour</h1>
        <p className="mt-2 text-muted-foreground">Connectez-vous pour retrouver votre espace.</p>
      </div>
      {search.reason === "session_expired" && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm"
        >
          Votre session a expiré, reconnectez-vous.
        </p>
      )}
      <form onSubmit={onSubmit} noValidate className="mt-7 grid gap-5">
        <FormError message={errors.root?.message} />
        <AuthInput
          id="login-email"
          label="Adresse email"
          error={errors.email?.message}
          icon={<Mail />}
        >
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="vous@universite.mg"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </AuthInput>
        <AuthInput
          id="login-password"
          label="Mot de passe"
          error={errors.password?.message}
          icon={<LockKeyhole />}
        >
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
        </AuthInput>
        {isDemo && (
          <fieldset className="grid gap-2 rounded-xl border bg-muted/40 p-3">
            <legend className="px-1 text-xs font-medium text-muted-foreground">
              Compte de démo
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(roleLabels) as Role[]).map((item) => (
                <label key={item} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="role"
                    checked={role === item}
                    onChange={() => setRole(item)}
                  />
                  {roleLabels[item]}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <Button type="submit" size="lg" className="mt-1 w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            "Connexion…"
          ) : (
            <>
              Se connecter <ArrowRight />
            </>
          )}
        </Button>
      </form>
      <p className="mt-7 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Créer mon compte
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main className="relative grid min-h-screen overflow-hidden bg-muted/30 px-4 py-8 lg:grid-cols-[1.05fr_.95fr] lg:p-6">
      <div className="absolute -left-28 -top-28 size-96 rounded-full bg-primary/10 blur-3xl" />
      <section className="relative hidden min-h-[calc(100vh-3rem)] flex-col justify-between rounded-3xl bg-primary p-10 text-primary-foreground lg:flex">
        <GraduationCap className="size-12" />
        <div className="max-w-md">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[.22em] text-primary-foreground/70">
            {eyebrow}
          </p>
          <h2 className="text-4xl font-bold leading-tight">{title}</h2>
          <p className="mt-5 text-base leading-7 text-primary-foreground/80">{description}</p>
        </div>
        <p className="text-sm text-primary-foreground/70">
          Une expérience pensée pour votre réussite.
        </p>
      </section>
      <section className="relative grid place-items-center py-6 lg:py-12">
        <div className="w-full max-w-md rounded-3xl border bg-card p-6 shadow-xl shadow-primary/5 sm:p-9">
          {children}
        </div>
      </section>
    </main>
  );
}
export function AuthInput({
  id,
  label,
  error,
  icon,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Field id={id} label={label} error={error}>
      <div className="relative [&>input]:h-11 [&>input]:pl-10">
        <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-muted-foreground [&>svg]:size-4">
          {icon}
        </span>
        {children}
      </div>
    </Field>
  );
}
