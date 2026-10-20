// src/components/emimood/templates/ConsoleLayout.tsx
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { ThemeSwitcher } from "@/components/emimood/molecules/ThemSwitcher";
import { Button } from "@/components/ui/button";
import { useInactivity } from "@/hooks/useInactivity";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export type NavItem<TTo extends string> = {
  to: TTo;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};
export type NavGroup<TTo extends string> = { group?: string; items: readonly NavItem<TTo>[] };
export type NavLinkProps = {
  className: string;
  "aria-current"?: "page" | undefined;
  children: ReactNode;
};

type ConsoleLayoutProps<TTo extends string> = {
  /** Logo cliquable, fourni par l'espace. */
  brand: ReactNode;
  /** Pastille de la barre du haut (« Administration », « Espace enseignant »). */
  badge: string;
  navLabel: string;
  nav: readonly NavGroup<TTo>[];
  /** Chaque espace fournit son <Link> : le routeur garde ainsi ses vérifications de types. */
  link: (to: TTo, props: NavLinkProps) => ReactNode;
  /** Emplacement facultatif dans la barre du haut (ex. sélecteur d'université). */
  scope?: ReactNode;
  children: ReactNode;
};

export function ConsoleLayout<TTo extends string>({
  brand,
  badge,
  navLabel,
  nav,
  link,
  scope,
  children,
}: ConsoleLayoutProps<TTo>) {
  const { user, logout, connectionLost } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const logoutRef = useRef(logout);
  logoutRef.current = logout;
  const [onTimeout] = useState(() => () => void logoutRef.current());
  const { warning, stay } = useInactivity(onTimeout);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (item: NavItem<TTo>) =>
    item.exact
      ? pathname === item.to || pathname === `${item.to}/`
      : pathname === item.to || pathname.startsWith(`${item.to}/`);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <a
        href="#console-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2"
      >
        Aller au contenu
      </a>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r bg-card px-3 py-4 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label={navLabel}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          {brand}
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
          {nav.map((group, index) => (
            <div key={group.group ?? index}>
              {group.group && (
                <p className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </p>
              )}
              <ul className="grid gap-0.5">
                {group.items.map((item) => {
                  const active = isActive(item);
                  return (
                    <li key={item.to}>
                      {link(item.to, {
                        "aria-current": active ? "page" : undefined,
                        className: cn(
                          "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium no-underline transition-colors",
                          active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted",
                        ),
                        children: (
                          <>
                            <item.icon className="size-4" aria-hidden />
                            {item.label}
                          </>
                        ),
                      })}
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
            {badge}
          </span>
          {scope}
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
        <main id="console-main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
