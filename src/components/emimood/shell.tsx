import { Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Home,
  Files,
  MessageSquare,
  Bell,
  UserRound,
  Settings,
  BriefcaseBusiness,
  ClipboardCheck,
  MessagesSquare,
  GraduationCap,
  Search,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  ArrowUpRight,
  PlayCircle,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme";
import type { ReactNode } from "react";
const links = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/cours", label: "Mes cours", icon: BookOpen },
  { to: "/ressources", label: "Ressources", icon: Files },
  { to: "/videos", label: "Vidéos", icon: PlayCircle },
  { to: "/publications", label: "Publications", icon: MessagesSquare },
  { to: "/evaluations", label: "Évaluations", icon: ClipboardCheck },
  { to: "/opportunites", label: "Opportunités", icon: BriefcaseBusiness },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/notifications", label: "Notifications", icon: Bell },
] as const;
export function Avatar({ initials = "PN", warm = false }: { initials?: string; warm?: boolean }) {
  return <span className={`avatar ${warm ? "warm" : ""}`}>{initials}</span>;
}
export function ThemeMenu() {
  const { setTheme } = useTheme();
  return (
    <>
      <DropdownMenuLabel>Apparence</DropdownMenuLabel>
      <DropdownMenuItem onClick={() => setTheme("light")}>
        <Sun /> Clair
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("dark")}>
        <Moon /> Sombre
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => setTheme("system")}>
        <Monitor /> Système
      </DropdownMenuItem>
    </>
  );
}
export function Shell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <>
      <aside className="sidebar">
        <Link to="/" className="brand">
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
        <p className="nav-label mt-7">Gestion (démo)</p>
        <nav>
          {(
            [
              { to: "/enseignant", label: "Enseignant", icon: GraduationCap },
              { to: "/delegue", label: "Délégué", icon: ShieldCheck },
              { to: "/administration", label: "Super admin", icon: Building2 },
            ] as const
          ).map((item) => (
            <Link key={item.to} to={item.to} activeProps={{ className: "active" }} className="nav-item">
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
            <Avatar />
            <div>
              <strong className="text-xs">Patrick Nomentsoa</strong>
              <p className="small">Étudiant · L3 Informatique</p>
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
                  <Avatar />
                  <ChevronDown size={13} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Patrick Nomentsoa</DropdownMenuLabel>
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
                <ThemeMenu />
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
export function Heading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
export function SectionHeading({
  title,
  to,
}: {
  title: string;
  to?: "/cours" | "/ressources" | "/opportunites" | "/publications" | "/evaluations";
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {to && (
        <Link to={to}>
          Voir tout <ArrowUpRight size={13} />
        </Link>
      )}
    </div>
  );
}
