import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { roleHome, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/inscription")({
  head: () => ({ meta: [{ title: "Inscription — EMIMood" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-8">
      <form
        className="w-full max-w-md rounded-2xl border bg-card p-6"
        onSubmit={async (event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          const password = String(form.get("password"));
          if (password !== String(form.get("passwordConfirmation"))) {
            setError("Les mots de passe ne correspondent pas.");
            return;
          }
          setBusy(true);
          setError("");
          try {
            const phoneNumber = String(form.get("phoneNumber")).trim();
            const user = await register({
              first_name: String(form.get("firstName")).trim(),
              last_name: String(form.get("lastName")).trim(),
              ...(phoneNumber ? { phone_number: phoneNumber } : {}),
              email: String(form.get("email")).trim(),
              password,
              invitation_code: String(form.get("invitationCode")).trim(),
            });
            navigate({ to: roleHome[user.role] });
          } catch (reason) {
            setError(reason instanceof Error ? reason.message : "Inscription impossible.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <Link to="/" className="mb-5 flex items-center gap-2 text-lg font-extrabold text-foreground no-underline">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><GraduationCap size={18} /></span>
          EMIMood
        </Link>
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <p className="mb-5 text-sm text-muted-foreground">Utilisez le code d’invitation de votre classe ou université.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Prénom" name="firstName" required />
          <Field label="Nom" name="lastName" required />
        </div>
        <Field label="Email" name="email" type="email" required />
        <Field label="Téléphone (facultatif)" name="phoneNumber" type="tel" />
        <Field label="Code d’invitation" name="invitationCode" required />
        <Field label="Mot de passe" name="password" type="password" minLength={8} required />
        <Field label="Confirmer le mot de passe" name="passwordConfirmation" type="password" minLength={8} required />
        {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{busy ? "Création…" : "Créer mon compte"}</Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">Déjà inscrit ? <Link to="/connexion" className="font-medium text-primary">Se connecter</Link></p>
      </form>
    </div>
  );
}

function Field({ label, name, type = "text", required = false, minLength }: { label: string; name: string; type?: string; required?: boolean; minLength?: number }) {
  return <label className="block text-sm font-medium">{label}<Input name={name} type={type} required={required} minLength={minLength} className="mt-1" /></label>;
}
