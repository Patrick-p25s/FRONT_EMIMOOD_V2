// Seul module qui lit/écrit l'état de session côté navigateur.
// accessToken : en mémoire uniquement. Le refresh token est un cookie httpOnly,
// invisible pour le JavaScript : seul un indicateur NON SECRET est conservé.
export const SESSION_KEY = "app.session";
const LEGACY_RT_KEY = "app.rt"; // ancien stockage du refresh token : à purger

let accessToken: string | null = null;

const safe = (fn: () => void) => {
  try {
    fn();
  } catch {
    /* stockage indisponible */
  }
};

export const tokenStore = {
  getAccess: (): string | null => accessToken,
  setAccess: (t: string | null) => {
    accessToken = t;
  },
  hasSession: (): boolean => {
    safe(() => localStorage.removeItem(LEGACY_RT_KEY));
    try {
      return localStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  },
  markSession: () => safe(() => localStorage.setItem(SESSION_KEY, "1")),
  clear: () => {
    accessToken = null;
    safe(() => {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(LEGACY_RT_KEY);
    });
  },
};
/** Secondes avant expiration de l'access token (décodage pour le calendrier uniquement). */
export function accessExpiresIn(token: string | null = accessToken): number {
  if (!token) return -Infinity;
  try {
    const part = token.split(".")[1] ?? "";
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const exp = (JSON.parse(json) as { exp?: number }).exp;
    return typeof exp === "number" ? exp - Date.now() / 1000 : Infinity;
  } catch {
    return Infinity;
  }
}
