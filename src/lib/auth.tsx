import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { clearTokens, getRefreshToken, setTokens } from "@/api/client";
import {
  identityApi,
  type RegisterPayload,
  type Role,
  type User,
  type UserContext,
} from "@/api/identity";

export type { Role } from "@/api/identity";
export type SessionUser = User & { name: string };

export const roleLabels: Record<Role, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  moderator: "Modérateur",
  super_admin: "Super administrateur",
};
export const roleHome: Record<Role, "/accueil" | "/enseignant" | "/administration"> = {
  student: "/accueil",
  teacher: "/enseignant",
  moderator: "/enseignant",
  super_admin: "/administration",
};

type Ctx = {
  user: SessionUser | null;
  context: UserContext | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<SessionUser>;
  register: (payload: RegisterPayload) => Promise<SessionUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (
    data: Pick<User, "first_name" | "last_name" | "phone_number" | "avatar_url" | "bio">,
  ) => Promise<void>;
};
const AuthContext = createContext<Ctx | null>(null);

function toSessionUser(user: User): SessionUser {
  return { ...user, name: `${user.first_name} ${user.last_name}`.trim() };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [context, setContext] = useState<UserContext | null>(null);
  const [ready, setReady] = useState(false);

  const loadProfile = async () => {
    const profile = await identityApi.me();
    const sessionUser = toSessionUser(profile);
    const academicContext = await identityApi.context(profile);
    setUser(sessionUser);
    setContext(academicContext);
    return sessionUser;
  };

  useEffect(() => {
    loadProfile()
      .catch(() => clearTokens())
      .finally(() => setReady(true));
  }, []);

  async function login(email: string, password: string) {
    const tokens = await identityApi.login(email, password);
    setTokens(tokens);
    try {
      return await loadProfile();
    } catch (error) {
      clearTokens();
      throw error;
    }
  }

  async function register(payload: RegisterPayload) {
    const tokens = await identityApi.register(payload);
    setTokens(tokens);
    try {
      return await loadProfile();
    } catch (error) {
      clearTokens();
      throw error;
    }
  }

  async function logout() {
    try {
      await identityApi.logout(getRefreshToken());
    } finally {
      clearTokens();
      setUser(null);
      setContext(null);
    }
  }

  async function refreshProfile() {
    await loadProfile();
  }
  async function updateProfile(
    data: Pick<User, "first_name" | "last_name" | "phone_number" | "avatar_url" | "bio">,
  ) {
    setUser(toSessionUser(await identityApi.updateMe(data)));
  }

  return (
    <AuthContext.Provider
      value={{ user, context, ready, login, register, logout, refreshProfile, updateProfile }}
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

export const spaceAccess: Record<string, Role[]> = {
  "/enseignant": ["teacher", "moderator"],
  "/administration": ["super_admin"],
  "/delegue": ["student"],
};
export function canAccess(role: Role | undefined, path: string) {
  const allowed = spaceAccess[path];
  return !allowed || (!!role && allowed.includes(role));
}
