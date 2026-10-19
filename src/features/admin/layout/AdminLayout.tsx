import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Building2,
  CalendarRange,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { refreshTokens } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import { useActiveUniversity } from "@/features/admin/hooks/useActiveUniversity";
import { SimpleSelect } from "@/components/emimood/molecules/filters";
import { ThemeSwitcher } from "@/components/emimood/molecules/ThemSwitcher";

const nav = [
  {
    group: "Vue d’ensemble",
    items: [{ to: "/admin", label: "Tableau de bord", icon: LayoutDashboard }],
  },
  {
    group: "Organisation",
    items: [
      { to: "/admin/universities", label: "Universités", icon: Building2 },
      { to: "/admin/academic-years", label: "Années académiques", icon: CalendarRange },
      { to: "/admin/classes", label: "Classes et codes", icon: School },
    ],
  },
  {
    group: "Personnes",
    items: [{ to: "/admin/users", label: "Utilisateurs", icon: Users }],
  },
  { group: "Pédagogie", items: [{ to: "/admin/subjects", label: "Matières", icon: BookOpen }] },
] as const;

const IDLE_MS = 30 * 60 * 1000;
const WARN_MS = 60 * 1000;

function useInactivity(onTimeout: () => void) {
  const [warning, setWarning] = useState(false);
  const last = useRef(Date.now());
  useEffect(() => {
    const bump = () => {
      last.current = Date.now();
    };
    const events = ["mousemove", "keydown", "pointerdown", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const t = setInterval(() => {
      const idle = Date.now() - last.current;
      if (idle >= IDLE_MS) onTimeout();
      else setWarning(idle >= IDLE_MS - WARN_MS);
    }, 5000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      clearInterval(t);
    };
  }, [onTimeout]);
  const stay = async () => {
    last.current = Date.now();
    setWarning(false);
    await refreshTokens();
  };
  return { warning, stay };
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout, connectionLost } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { universityId, setUniversity, universities } = useActiveUniversity();
  const [open, setOpen] = useState(false);
  const logoutRef = useRef(logout);
  logoutRef.current = logout;
  const [onTimeout] = useState(() => () => void logoutRef.current());
  const { warning, stay } = useInactivity(onTimeout);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2"
      >
        Aller au contenu
      </a>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r bg-card px-3 py-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Navigation d’administration"
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <Link to="/admin" className="text-lg font-extrabold text-foreground no-underline">
            EMI<span className="text-primary">Mood</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>
        <nav className="grid gap-5">
          {nav.map((g) => (
            <div key={g.group}>
              <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {g.group}
              </p>
              <ul className="grid gap-0.5">
                {g.items.map((it) => {
                  const active =
                    it.to === "/admin"
                      ? pathname === "/admin" || pathname === "/admin/"
                      : pathname.startsWith(it.to);
                  return (
                    <li key={it.to}>
                      <Link
                        to={it.to}
                        search={(p: { u?: string | undefined }) => ({ u: p.u })}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium no-underline transition-colors",
                          active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                        )}
                      >
                        <it.icon className="size-4" aria-hidden />
                        {it.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/30 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Ouvrir le menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary-foreground">
            Administration
          </span>
          <div className="flex items-center gap-2">
            <label
              htmlFor="active-university"
              className="hidden text-sm text-muted-foreground sm:inline"
            >
              Université
            </label>
            <SimpleSelect
              id="active-university"
              value={universityId}
              onChange={setUniversity}
              options={universities.map((u) => ({ value: u.id, label: u.name }))}
              placeholder="Université"
              allLabel="Toutes les universités"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeSwitcher />
            <span className="hidden text-sm text-muted-foreground md:inline">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={() => void logout()}>
              <LogOut className="size-4" /> Déconnexion
            </Button>
          </div>
        </header>
        {connectionLost && (
          <div
            role="status"
            className="border-b border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive"
          >
            Connexion perdue, nouvelle tentative…
          </div>
        )}
        {warning && (
          <div
            role="alertdialog"
            aria-live="assertive"
            className="flex flex-wrap items-center gap-3 border-b bg-muted px-4 py-2 text-sm"
          >
            Vous serez déconnecté dans une minute pour inactivité.
            <Button size="sm" onClick={() => void stay()}>
              Rester connecté
            </Button>
          </div>
        )}
        <main id="admin-main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
