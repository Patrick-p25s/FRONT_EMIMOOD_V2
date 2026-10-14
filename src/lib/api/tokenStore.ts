// Seul module qui lit/écrit les jetons.
// accessToken : en mémoire uniquement. refreshToken : localStorage (l'API le renvoie dans le corps).
// TODO : migrer le refresh token vers un cookie httpOnly quand l'API le permettra.
export const RT_KEY = "app.rt";

let accessToken: string | null = null;

export const tokenStore = {
  getAccess: (): string | null => accessToken,
  setAccess: (t: string | null) => {
    accessToken = t;
  },
  getRefresh: (): string | null => {
    try {
      return localStorage.getItem(RT_KEY);
    } catch {
      return null;
    }
  },
  setRefresh: (t: string) => {
    try {
      localStorage.setItem(RT_KEY, t);
    } catch {
      /* stockage indisponible */
    }
  },
  clear: () => {
    accessToken = null;
    try {
      localStorage.removeItem(RT_KEY);
    } catch {
      /* ignore */
    }
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
