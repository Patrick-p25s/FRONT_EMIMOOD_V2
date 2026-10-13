const API_URL = (import.meta.env["VITE_API_URL"] as string | undefined)?.replace(/\/$/, "");
const REFRESH_TOKEN_KEY = "emimood-refresh-token";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Tokens = { accessToken: string; refreshToken: string };
type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown; authenticated?: boolean };

let accessToken: string | null = null;
let refreshPromise: Promise<Tokens> | null = null;

export function getRefreshToken() {
  return typeof window === "undefined" ? null : sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: Tokens) {
  accessToken = tokens.accessToken;
  sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens() {
  accessToken = null;
  if (typeof window !== "undefined") sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function parseError(response: Response) {
  const fallback = `La requête a échoué (${response.status}).`;
  try {
    const body = (await response.json()) as { detail?: string };
    return body.detail || fallback;
  } catch {
    return fallback;
  }
}

async function refreshTokens(): Promise<Tokens> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new ApiError("Votre session a expiré.", 401);

  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!response.ok) throw new ApiError(await parseError(response), response.status);
  const tokens = (await response.json()) as Tokens;
  setTokens(tokens);
  return tokens;
}

async function send<T>(path: string, options: RequestOptions = {}, retried = false): Promise<T> {
  if (!API_URL) throw new Error("VITE_API_URL doit pointer vers l'API FastAPI.");
  const { body, authenticated = true, headers, ...init } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(authenticated && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 401 && authenticated && !retried && path !== "/auth/refresh") {
    try {
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null;
      });
      await refreshPromise;
      return send<T>(path, options, true);
    } catch (error) {
      clearTokens();
      throw error;
    }
  }
  if (!response.ok) throw new ApiError(await parseError(response), response.status);
  return response.status === 204 ? (undefined as T) : ((await response.json()) as T);
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => send<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    send<T>(path, { ...options, method: "POST", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    send<T>(path, { ...options, method: "PATCH", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    send<T>(path, { ...options, method: "PUT", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    send<T>(path, { ...options, method: "DELETE" }),
};
