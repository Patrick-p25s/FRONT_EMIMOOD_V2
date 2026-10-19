import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Bell, Building2, ChevronDown, GraduationCap, Home, LogOut, MessageSquare, Search, Settings, ShieldCheck, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { roleLabels, useAuth } from "@/lib/auth";
import { links } from "@/components/emimood/templates/navLinks";
import { Avatar } from "@/components/emimood/atoms/Avatar";
import { ThemeMenu } from "@/components/emimood/molecules/ThemeMenu";

export function Shell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role;
  const manage = [
    {
      to: "/enseignant",
      label: "Espace enseignant",
      icon: GraduationCap,
      show: role === "teacher",
    },
    {
      to: "/admin",
      label: "Super administration",
      icon: Building2,
      show: role === "super_admin",
    },
    { to: "/delegue", label: "Espace délégué", icon: ShieldCheck, show: role === "student" },
  ].filter((m) => m.show) as {
    to: "/enseignant" | "/admin" | "/delegue";
    label: string;
    icon: typeof Home;
  }[];
  const initials = (user?.name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const signOut = () => {
    void logout();
    navigate({ to: "/connexion", replace: true });
  };
  return (
    <>
      <aside className="sidebar">
        <Link to="/accueil" className="brand">
          <span className="brand-mark">
            <GraduationCap size={33} strokeWidth={2.3} />
          </span>
          <span>
            EMI<em>Mood</em>
            <span className="text-primary">.</span>
          </span>
        </Link>
        <div className="university">
          <span className="university-icon">
            <GraduationCap size={19} />
          </span>
          <div>
            <strong className="text-xs">EMIT Fianarantsoa</strong>
            <p className="small">Notre communauté</p>
          </div>
          <ChevronDown size={13} />
        </div>
        <p className="nav-label">Mon espace</p>
        <nav>
          {links.slice(0, 7).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "active" }}
              className="nav-item"
            >
              <item.icon />
              {item.label}
              {item.to === "/evaluations" && <span className="nav-badge">2</span>}
            </Link>
          ))}
        </nav>
        <p className="nav-label mt-7">Communauté</p>
        <nav>
          {links.slice(7).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "active" }}
              className="nav-item"
            >
              <item.icon />
              {item.label}
              {item.to === "/messages" && <span className="nav-badge">3</span>}
            </Link>
          ))}
        </nav>
        <p className="nav-label mt-7">Gestion</p>
        <nav>
          {manage.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeProps={{ className: "active" }}
              className="nav-item"
            >
              <item.icon />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link to="/parametres" activeProps={{ className: "active" }} className="nav-item">
            <Settings />
            Paramètres
          </Link>
          <Link to="/profil" className="account text-foreground no-underline">
            <Avatar initials={initials} />
            <div>
              <strong className="text-xs">{user?.name}</strong>
              <p className="small">{role ? roleLabels[role] : ""}</p>
            </div>
            <ChevronDown size={13} />
          </Link>
        </div>
      </aside>
      <main className="app-main">
        <header className="topbar">
          <form
            className="search-box"
            onSubmit={(e) => {
              e.preventDefault();
              const value = new FormData(e.currentTarget).get("q");
              navigate({ to: "/recherche", search: { q: String(value ?? "") } });
            }}
          >
            <Search size={18} />
            <input
              name="q"
              placeholder="Rechercher un cours, une ressource, une personne…"
              aria-label="Recherche globale"
            />
          </form>
          <div className="header-actions">
            <Link className="icon-link" to="/messages" aria-label="Messages">
              <MessageSquare size={19} />
            </Link>
            <Link className="icon-link" to="/notifications" aria-label="Notifications">
              <Bell size={19} />
              <span className="notification-dot" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-1" aria-label="Menu du profil">
                  <Avatar initials={initials} />
                  <ChevronDown size={13} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/profil">
                    <UserRound /> Mon profil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/parametres">
                    <Settings /> Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {manage.map((item) => (
                  <DropdownMenuItem asChild key={item.to}>
                    <Link to={item.to}>
                      <item.icon /> {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <ThemeMenu />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut /> Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {children}
      </main>
      <nav className="mobile-nav">
        {[
          links[0],
          links[1],
          links[3],
          links[7],
          { to: "/profil", label: "Profil", icon: UserRound },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: true }}
            activeProps={{ className: "active" }}
          >
            <item.icon />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
