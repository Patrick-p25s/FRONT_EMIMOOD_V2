import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, roleHome, roleLabels, isDemo, type Role } from "@/lib/auth";
import { safeNext } from "@/lib/api/list";

type LoginSearch = { next?: string | undefined; reason?: string | undefined };

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
  validateSearch: (s: Record<string, unknown>): LoginSearch => ({
    next: typeof s["next"] === "string" ? s["next"] : undefined,
    reason: typeof s["reason"] === "string" ? s["reason"] : undefined,
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const demo = isDemo;
  const search = Route.useSearch();

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
            const u = await login(String(f.get("email")), String(f.get("password")), role);
            const next = safeNext(search.next);
            const nextIsAdmin = !!next && (next === "/admin" || next.startsWith("/admin/") || next.startsWith("/admin?"));
            if (next && (!nextIsAdmin || u.role === "super_admin")) navigate({ href: next, replace: true });
            else navigate({ to: roleHome[u.role], replace: true });
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
        {search.reason === "session_expired" && (
          <p role="alert" className="mb-4 rounded-md border bg-muted px-3 py-2 text-sm">Votre session a expiré, reconnectez-vous.</p>
        )}
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <Input id="email" name="email" type="email" required defaultValue={demo ? "patrick@emit.mg" : ""} className="mb-3 mt-1" />
        <label className="text-sm font-medium" htmlFor="password">Mot de passe</label>
        <Input id="password" name="password" type="password" required defaultValue={demo ? "demo1234" : ""} className="mb-4 mt-1" />
        {demo && (
          <fieldset className="mb-4">
            <legend className="mb-2 text-sm font-medium">Démo : se connecter en tant que</legend>
            <div className="grid gap-2">
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <label key={r} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <input type="radio" name="role" checked={role === r} onChange={() => setRole(r)} />
                  {roleLabels[r]}
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Connexion…" : "Se connecter"}
        </Button>
      </form>
    </div>
  );
}
