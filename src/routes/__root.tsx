import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  useNavigate,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { ThemeProvider } from "@/components/emimood/theme";
import { Shell } from "@/components/emimood/templates";
import { NotFoundView, FullScreenLoader } from "@/components/emimood/molecules/NotFoundView";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider, useAuth, canAccess } from "@/lib/auth";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return <NotFoundView />;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Cette page n’a pas pu être chargée
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Une erreur est survenue. Réessayez ou revenez à l’accueil.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Réessayer
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Retour à l’accueil
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EMIMood — Communauté universitaire EMIT" },
      { name: "description", content: "La communauté académique et sociale de l’EMIT à Fianarantsoa." },
      
      { property: "og:title", content: "EMIMood — Communauté universitaire EMIT" },
      { property: "og:description", content: "La communauté académique et sociale de l’EMIT à Fianarantsoa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;650;700;750;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render inside AppFrame via <Outlet />. */}
      <ThemeProvider>
        <AuthProvider>
          <AppFrame />
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const publicPaths = ["/", "/connexion"];

function AppFrame() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const href = useRouterState({ select: (s) => s.location.href });
  const { user, ready, connectionLost } = useAuth();
  const navigate = useNavigate();
  const isPublic = publicPaths.includes(pathname);
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  useEffect(() => {
    if (ready && !user && !isPublic) navigate({ to: "/connexion", search: { next: href }, replace: true });
  }, [ready, user, isPublic, navigate, href]);

  if (isPublic) return <Outlet />;
  if (!ready || !user) return <FullScreenLoader label={connectionLost ? "Connexion perdue, nouvelle tentative…" : "Chargement…"} />;
  // L'espace admin a son propre layout et son propre garde (aucun Shell utilisateur).
  if (isAdmin) return <Outlet />;
  return (
    <Shell>
      {connectionLost && (
        <div role="status" className="mb-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          Connexion perdue, nouvelle tentative…
        </div>
      )}
      {canAccess(user.role, pathname) ? (
        <Outlet />
      ) : (
        <div className="page">
          <h1 className="text-xl font-bold">Accès réservé</h1>
          <p className="subtitle">Cet espace n’est pas disponible pour votre rôle.</p>
        </div>
      )}
    </Shell>
  );
}
