import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, roleHome } from "@/lib/auth";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion — EMIMood" },
      { name: "description", content: "Connectez-vous à votre espace EMIMood : étudiant, enseignant ou administration." },
      { property: "og:title", content: "Connexion — EMIMood" },
      { property: "og:description", content: "Accédez à votre espace EMIMood." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <form
        className="w-full max-w-sm rounded-2xl border bg-card p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setBusy(true);
          setError("");
          try {
            const u = await login(String(f.get("email")), String(f.get("password")));
            navigate({ to: roleHome[u.role] });
          } catch (err) {
            setError(err instanceof Error ? err.message : "Connexion impossible.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <Link to="/" className="mb-5 flex items-center gap-2 text-lg font-extrabold text-foreground no-underline">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap size={18} />
          </span>
          EMIMood
        </Link>
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="mb-5 text-sm text-muted-foreground">Avec votre compte universitaire.</p>
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" required className="mb-3 mt-1" />
        <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
        <Input id="password" name="password" type="password" required className="mb-4 mt-1" />
        {error && <p className="mb-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Connexion…" : "Se connecter"}
        </Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Nouveau sur EMIMood ? <Link to="/inscription" className="font-medium text-primary">Créer un compte</Link>
        </p>
      </form>
    </div>
  );
}
