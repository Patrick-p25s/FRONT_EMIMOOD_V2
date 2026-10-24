import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  API_URL,
  ApiError,
  api,
  endSession,
  initCrossTab,
  onConnection,
  onRefreshed,
  onSessionEnd,
  refreshTokens,
} from "@/lib/api/client";
import { accessExpiresIn, tokenStore } from "@/lib/api/tokenStore";

export type Role = "student" | "teacher" | "moderator" | "super_admin";
export type Statut = "active" | "suspend" | "inactive";
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  statut: Statut;
  university_id: string | null;
};
export type MeResponse = {
  id: string;
  university_id: string | null;
  classe_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
  statut: Statut;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};
export type RegisterPayload = {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  password: string;
  invitation_code: string;
};

export const roleLabels: Record<Role, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  moderator: "Modérateur",
  super_admin: "Super administrateur",
};
export const statutLabels: Record<Statut, string> = {
  active: "Actif",
  suspend: "Suspendu",
  inactive: "Désactivé",
};
export const roleHome: Record<Role, "/accueil" | "/enseignant" | "/admin"> = {
  student: "/accueil",
  teacher: "/enseignant",
  moderator: "/accueil",
  super_admin: "/admin",
};
export const isDemo = !API_URL;

type Ctx = {
  user: SessionUser | null;
  ready: boolean;
  connectionLost: boolean;
  login: (email: string, password: string, demoRole: Role) => Promise<SessionUser>;
  register: (payload: RegisterPayload) => Promise<SessionUser>;
  logout: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
};
const AuthContext = createContext<Ctx | null>(null);

const toUser = (m: MeResponse): SessionUser => ({
  id: m.id,
  name: `${m.first_name} ${m.last_name}`.trim(),
  email: m.email,
  role: m.role,
  statut: m.statut,
  university_id: m.university_id,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  const [connectionLost, setConnectionLost] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.href });
  const pathRef = useRef(pathname);
  pathRef.current = pathname;
  const userRef = useRef(user);
  userRef.current = user;

  useEffect(() => {
    initCrossTab();
    const offEnd = onSessionEnd((reason) => {
      setUser(null);
      queryClient.clear();
      if (reason.kind === "expired") {
        navigate({
          to: "/connexion",
          search: { reason: "session_expired", next: pathRef.current },
          replace: true,
        });
      } else if (reason.kind === "blocked") {
        toast.error(reason.message);
        navigate({ to: "/connexion", replace: true });
      } else {
        navigate({ to: "/connexion", replace: true });
      }
    });
    const offConn = onConnection((lost) => {
      setConnectionLost(lost);
    });
    // Après chaque rafraîchissement : re-vérifier le rôle et le statut
    const offRef = onRefreshed(() => {
      const prev = userRef.current;
      if (!prev) return;
      api<MeResponse>("/users/me")
        .then((me) => {
          if (me.role !== prev.role || me.statut !== "active")
            endSession({ kind: "blocked", message: "Votre compte a changé, reconnectez-vous." });
        })
        .catch(() => undefined);
    });
    const onVisible = () => {
      if (
        document.visibilityState === "visible" &&
        userRef.current &&
        !isDemo &&
        accessExpiresIn() < 60
      )
        void refreshTokens();
    };
    document.addEventListener("visibilitychange", onVisible);

    (async () => {
      if (isDemo || !tokenStore.getRefresh()) return setReady(true);
      const ok = await refreshTokens(null);
      if (ok) {
        try {
          setUser(toUser(await api<MeResponse>("/users/me")));
        } catch {
          /* géré par le client */
        }
      }
      setReady(true);
    })();
    return () => {
      offEnd();
      offConn();
      offRef();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [navigate, queryClient]);

  async function login(email: string, password: string, demoRole: Role) {
    if (isDemo) {
      const names: Record<Role, string> = {
        student: "Patrick Nomentsoa",
        teacher: "Hanta Rakoto",
        moderator: "Modérateur EMIT",
        super_admin: "Administrateur EMIT",
      };
      const u: SessionUser = {
        id: "demo",
        name: names[demoRole],
        email,
        role: demoRole,
        statut: "active",
        university_id: null,
      };
      setUser(u);
      return u;
    }
    try {
      const t = await api<{ accessToken: string; refreshToken: string }>("/auth/login", {
        method: "POST",
        body: { email, password },
        auth: false,
      });
      tokenStore.setRefresh(t.refreshToken);
      tokenStore.setAccess(t.accessToken);
    } catch (e) {
      if (e instanceof ApiError && e.status === 429) throw e;
      if (e instanceof ApiError && e.status === 0) throw e;
      throw new Error("Email ou mot de passe incorrect");
    }
    const u = toUser(await api<MeResponse>("/users/me"));
    setUser(u);
    return u;
  }

  async function register(payload: RegisterPayload) {
    if (isDemo) return login(payload.email, payload.password, "student");
    const tokens = await api<{ accessToken: string; refreshToken: string }>("/auth/register", {
      method: "POST",
      body: payload,
      auth: false,
    });
    tokenStore.setRefresh(tokens.refreshToken);
    tokenStore.setAccess(tokens.accessToken);
    const u = toUser(await api<MeResponse>("/users/me"));
    setUser(u);
    return u;
  }

  async function logout() {
    const rt = tokenStore.getRefresh();
    if (rt && !isDemo) {
      await api("/auth/logout", { method: "POST", body: { refreshToken: rt }, auth: false }).catch(
        () => undefined,
      );
    }
    endSession({ kind: "logout" });
    setUser(null);
  }

  async function changePassword(current: string, next: string) {
    await api("/auth/change-password", {
      method: "POST",
      body: { current_password: current, new_password: next },
    });
    toast.success("Mot de passe modifié. Reconnectez-vous sur tous vos appareils.");
    endSession({ kind: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{ user, ready, connectionLost, login, register, logout, changePassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth hors AuthProvider");
  return ctx;
}

/** Rôles autorisés par espace — le serveur FastAPI applique les vrais droits. */
export const spaceAccess: Record<string, Role[]> = {
  "/enseignant": ["teacher"],
  "/admin": ["super_admin"],
  "/delegue": ["student"],
};
export function canAccess(role: Role | undefined, path: string) {
  const key = Object.keys(spaceAccess).find((p) => path === p || path.startsWith(`${p}/`));
  const allowed = key ? spaceAccess[key] : undefined;
  return !allowed || (!!role && allowed.includes(role));
}
