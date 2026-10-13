import { RT_KEY, accessExpiresIn, tokenStore } from "@/lib/api/tokenStore";

export const API_URL = ((import.meta.env["VITE_API_URL"] as string | undefined) ?? "").replace(/\/$/, "");
const GENERIC = "Une erreur est survenue, réessayez";

export class ApiError extends Error {
  status: number;
  detail: string;
  fieldErrors?: Record<string, string>;
  constructor(status: number, detail: string, fieldErrors?: Record<string, string>) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.fieldErrors = fieldErrors;
  }
}

export type SessionEnd = { kind: "expired" } | { kind: "logout" } | { kind: "blocked"; message: string };
type Listener<T> = (v: T) => void;
const endListeners = new Set<Listener<SessionEnd>>();
const connListeners = new Set<Listener<boolean>>();
const refreshListeners = new Set<Listener<void>>();
export const onSessionEnd = (l: Listener<SessionEnd>) => (endListeners.add(l), () => endListeners.delete(l));
export const onConnection = (l: Listener<boolean>) => (connListeners.add(l), () => connListeners.delete(l));
export const onRefreshed = (l: Listener<void>) => (refreshListeners.add(l), () => refreshListeners.delete(l));

// ---------- Onglets multiples ----------
type Msg = { type: "access"; token: string } | { type: "logout" };
let channel: BroadcastChannel | null = null;
let crossTabReady = false;
function post(msg: Msg) {
  channel?.postMessage(msg);
}
export function initCrossTab() {
  if (crossTabReady || typeof window === "undefined") return;
  crossTabReady = true;
  if ("BroadcastChannel" in window) {
    channel = new BroadcastChannel("auth");
    channel.onmessage = (e: MessageEvent<Msg>) => {
      if (e.data.type === "access") tokenStore.setAccess(e.data.token);
      if (e.data.type === "logout") localEnd({ kind: "logout" });
    };
  }
  // Repli : suppression du refresh token par un autre onglet
  window.addEventListener("storage", (e) => {
    if (e.key === RT_KEY && e.newValue === null && tokenStore.getAccess()) localEnd({ kind: "logout" });
  });
}

function localEnd(reason: SessionEnd) {
  tokenStore.clear();
  endListeners.forEach((l) => l(reason));
}
export function endSession(reason: SessionEnd) {
  post({ type: "logout" });
  localEnd(reason);
}

// ---------- Rafraîchissement (single-flight + verrou inter-onglets) ----------
class Transient extends Error {}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function rawRefresh(): Promise<boolean> {
  const rt = tokenStore.getRefresh(); // relu à l'intérieur du verrou
  if (!rt) return false;
  let res: Response;
  try {
    res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: rt }),
    });
  } catch {
    throw new Transient();
  }
  if (res.status >= 500 || res.status === 429) throw new Transient();
  if (!res.ok) return false;
  const data = (await res.json()) as { accessToken: string; refreshToken: string };
  tokenStore.setRefresh(data.refreshToken);
  tokenStore.setAccess(data.accessToken);
  post({ type: "access", token: data.accessToken });
  return true;
}

let inflight: Promise<boolean> | null = null;

/** staleToken : le jeton qui a échoué. Si un autre appel l'a déjà remplacé, on ne rafraîchit pas. */
export function refreshTokens(staleToken: string | null = tokenStore.getAccess()): Promise<boolean> {
  if (inflight) return inflight;
  inflight = (async () => {
    const run = async (): Promise<boolean> => {
      const cur = tokenStore.getAccess();
      if (cur && cur !== staleToken && accessExpiresIn(cur) > 60) return true;
      let delay = 2000;
      for (;;) {
        try {
          const ok = await rawRefresh();
          connListeners.forEach((l) => l(false));
          return ok;
        } catch {
          connListeners.forEach((l) => l(true));
          await sleep(delay);
          delay = Math.min(delay * 2, 30000);
        }
      }
    };
    const locks = typeof navigator !== "undefined" ? navigator.locks : undefined;
    const ok = locks ? await locks.request("auth-refresh", run) : await run();
    if (ok) refreshListeners.forEach((l) => l());
    else localEnd({ kind: "expired" }), post({ type: "logout" });
    return ok;
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

// ---------- Client HTTP unique ----------
type Query = Record<string, string | number | boolean | null | undefined>;
type Opts = { method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"; body?: unknown; query?: Query; auth?: boolean };

function buildUrl(path: string, query?: Query) {
  const qs = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  });
  const s = qs.toString();
  return `${API_URL}${path}${s ? `?${s}` : ""}`;
}

async function toError(res: Response, path: string): Promise<ApiError> {
  if (res.status >= 500) return new ApiError(res.status, GENERIC);
  if (res.status === 429) return new ApiError(429, "Trop de tentatives, réessayez dans un instant");
  let detail = GENERIC;
  let fieldErrors: Record<string, string> | undefined;
  try {
    const body = (await res.json()) as { detail?: unknown };
    if (typeof body.detail === "string") detail = body.detail;
    else if (Array.isArray(body.detail)) {
      fieldErrors = {};
      for (const e of body.detail as { loc?: (string | number)[]; msg?: string }[]) {
        const field = e.loc?.[e.loc.length - 1];
        if (field !== undefined && e.msg) fieldErrors[String(field)] = e.msg;
      }
      detail = Object.values(fieldErrors)[0] ?? "Données invalides";
    }
  } catch {
    /* corps vide */
  }
  const err = new ApiError(res.status, detail, fieldErrors);
  if (res.status === 403 && (path === "/users/me" || /^Votre (compte|université|classe)/.test(detail))) {
    endSession({ kind: "blocked", message: detail });
  }
  return err;
}

export async function api<T>(path: string, opts: Opts = {}): Promise<T> {
  const { method = "GET", body, query, auth = true } = opts;
  if (!API_URL) throw new ApiError(0, "L’adresse de l’API (VITE_API_URL) n’est pas configurée.");
  if (auth && tokenStore.getAccess() && accessExpiresIn() < 60) await refreshTokens();

  const send = async () => {
    const token = auth ? tokenStore.getAccess() : null;
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    try {
      const res = await fetch(buildUrl(path, query), {
        method,
        headers,
        credentials: "omit",
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      return { res, token };
    } catch {
      throw new ApiError(0, GENERIC);
    }
  };

  let { res, token } = await send();
  if (res.status === 401 && auth && !path.startsWith("/auth/")) {
    const ok = await refreshTokens(token);
    if (!ok) throw new ApiError(401, "Session expirée");
    ({ res } = await send());
    if (res.status === 401) {
      endSession({ kind: "expired" });
      throw new ApiError(401, "Session expirée");
    }
  }
  if (!res.ok) throw await toError(res, path);
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
