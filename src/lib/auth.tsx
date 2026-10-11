import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "student" | "teacher" | "super_admin";
export type SessionUser = { name: string; email: string; role: Role; token?: string };

export const roleLabels: Record<Role, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  super_admin: "Super administrateur",
};
export const roleHome: Record<Role, "/accueil" | "/enseignant" | "/administration"> = {
  student: "/accueil",
  teacher: "/enseignant",
  super_admin: "/administration",
};

// URL du backend FastAPI (ex. http://localhost:8000). Sans elle, connexion de démonstration.
const API_URL = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "";
const KEY = "emimood-session";

type Ctx = {
  user: SessionUser | null;
  ready: boolean;
  login: (email: string, password: string, demoRole: Role) => Promise<SessionUser>;
  logout: () => void;
};
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  async function login(email: string, password: string, demoRole: Role) {
    let u: SessionUser;
    if (API_URL) {
      // POST /api/v1/auth/login -> { access_token, user: { full_name, email, role } }
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Email ou mot de passe incorrect.");
      const data = await res.json();
      u = { name: data.user.full_name, email: data.user.email, role: data.user.role, token: data.access_token };
    } else {
      const names: Record<Role, string> = { student: "Patrick Nomentsoa", teacher: "Hanta Rakoto", super_admin: "Administrateur EMIT" };
      u = { name: names[demoRole], email, role: demoRole };
    }
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }
  function logout() {
    localStorage.removeItem(KEY);
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth hors AuthProvider");
  return ctx;
}

/** Rôles autorisés par espace — à reproduire côté FastAPI avec require_role(). */
export const spaceAccess: Record<string, Role[]> = {
  "/enseignant": ["teacher"],
  "/administration": ["super_admin"],
  "/delegue": ["student"],
};
export function canAccess(role: Role | undefined, path: string) {
  const allowed = spaceAccess[path];
  return !allowed || (!!role && allowed.includes(role));
}
