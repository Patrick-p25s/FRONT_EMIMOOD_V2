import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  ChevronDown,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { roleLabels, useAuth } from "@/lib/auth";
import { links } from "@/components/emimood/templates/navLinks";
import { ThemeMenu } from "@/components/emimood/molecules/ThemeMenu";
import { RealtimeBridge } from "@/features/messaging/components/RealtimeBridge";
import { Brand } from "../atoms/Brand";
import { useAccount, useMyProfile } from "@/features/profile/hoooks/useProfile";
import { MessagesNavBadge } from "@/features/messaging/components/MessageNavBadge";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import { NotificationBadge } from "@/features/notification/components/NotificationBadge";
import { useMyUniversity } from "@/features/university/useMyUniversity";

export function Shell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role;
  const avatarUrl = useMyProfile().data?.avatar_url ?? null;
  const canMessage = role !== undefined && role !== "super_admin"; // le super admin n'a pas de messagerie (403)
  const isDelegate = useAccount().data?.is_delegate === true;
  const university = useMyUniversity(user?.university_id).data;
  const logo =
    university?.logo_url && /^https?:\/\//.test(university.logo_url) ? university.logo_url : null;
  const manage = [
    {
      to: "/enseignant",
      label: "Espace enseignant",
      icon: GraduationCap,
      show: role === "teacher",
    },
    { to: "/admin", label: "Super administration", icon: Building2, show: role === "super_admin" },
    {
      to: "/delegue",
      label: "Espace délégué",
      icon: ShieldCheck,
      show: role === "student" && isDelegate,
    },
  ].filter((m) => m.show) as {
    to: "/enseignant" | "/admin" | "/delegue";
    label: string;
    icon: typeof Home;
  }[];

  const communityLinks = links.slice(7).filter((item) => canMessage || item.to !== "/messages");

  const signOut = () => {
    void logout();
    navigate({ to: "/connexion", replace: true });
  };

  return (
    <>
      {canMessage && <RealtimeBridge />}
      <aside className="sidebar">
        <Brand link="/accueil" />
        <div className="university">
          <span className="university-icon">
            {logo ? (
              <img src={logo} alt="" className="size-full rounded-[inherit] object-cover" />
            ) : (
              <GraduationCap size={19} />
            )}
          </span>
          <div className="min-w-0">
            <strong className="block truncate text-xs">
              {university?.name ?? "Mon université"}
            </strong>
            <p className="small">Notre communauté</p>
          </div>
          <ChevronDown size={13} />
        </div>
        <div className="overflow-y-auto">
          <p className="nav-label">Mon espace</p>
          <nav aria-label="Mon espace">
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
              </Link>
            ))}
          </nav>
          <p className="nav-label mt-7">Communauté</p>
          <nav aria-label="Communauté">
            {communityLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{ className: "active" }}
                className="nav-item"
              >
                <item.icon />
                {item.label}
                {item.to === "/messages" && <MessagesNavBadge />}
              </Link>
            ))}
          </nav>
          {manage.length > 0 && (
            <>
              <p className="nav-label mt-7">Gestion</p>
              <nav aria-label="Gestion">
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
            </>
          )}
        </div>
        <div className="sidebar-bottom">
          <Link to="/parametres" activeProps={{ className: "active" }} className="nav-item">
            <Settings />
            Paramètres
          </Link>
          <Link to="/profil" className="account text-foreground no-underline">
            <UserAvatar name={user?.name ?? "?"} url={avatarUrl} />
            <div className="min-w-0">
              <strong className="block truncate text-xs">{user?.name}</strong>
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
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const value = String(new FormData(e.currentTarget).get("q") ?? "").trim();
              if (value.length >= 2) navigate({ to: "/recherche", search: { q: value } });
            }}
          >
            <Search size={18} />
            <input
              name="q"
              minLength={2}
              maxLength={100}
              autoComplete="off"
              placeholder="Rechercher un cours, une ressource, une personne…"
              aria-label="Recherche globale"
            />
          </form>
          <div className="header-actions">
            {canMessage && (
              <Link className="icon-link" to="/messages" aria-label="Messages">
                <MessageSquare size={19} />
              </Link>
            )}
            <Link className="icon-link" to="/notifications" aria-label="Notifications">
              <Bell size={19} />
              <NotificationBadge />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-1" aria-label="Menu du profil">
                  <UserAvatar name={user?.name ?? "?"} url={avatarUrl} />
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
                {manage.length > 0 && <DropdownMenuSeparator />}
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

      <nav className="mobile-nav" aria-label="Navigation mobile">
        {[
          links[0],
          links[1],
          links[3],
          ...(canMessage ? [links[7]] : []),
          { to: "/profil", label: "Profil", icon: UserRound },
        ].map((item) =>
          item ? (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "active" }}
            >
              <item.icon />
              {item.label}
              {item.to === "/messages" && <MessagesNavBadge />}
            </Link>
          ) : null,
        )}
      </nav>
    </>
  );
}
