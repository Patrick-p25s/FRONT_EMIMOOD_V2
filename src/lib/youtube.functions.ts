import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type VideoResult = { id: string; title: string; channel: string; thumbnail: string };
export type SearchError =
  "missing_key" | "unauthorized" | "rate_limited" | "quota_exceeded" | "request_failed";
export type SearchOutcome = { results: VideoResult[]; error: SearchError | null };

const MINUTE = 60_000;
const CACHE_TTL = 24 * 60 * MINUTE;
const MAX_CACHE = 300;
const MAX_RESULTS = 12;
const DAILY_BUDGET = Number(process.env["YOUTUBE_DAILY_SEARCHES"] ?? 90); // 90 × 100 unités = 9 000 sur 10 000
const USER_LIMIT = { count: 10, windowMs: 10 * MINUTE }; // recherches « neuves » par utilisateur
const VIDEO_ID = /^[\w-]{11}$/;

// Mémoire du processus : se vide au redémarrage (voir la note sur plusieurs instances).
const cache = new Map<string, { at: number; results: VideoResult[] }>();
const inflight = new Map<string, Promise<SearchOutcome>>();
const sessions = new Map<string, { userId: string; until: number }>();
const userHits = new Map<string, number[]>();
let budget = { day: "", used: 0 };
let blockedUntil = 0;

const fail = (error: SearchError): SearchOutcome => ({ results: [], error });
const normalize = (q: string) => q.toLowerCase().replace(/\s+/g, " ").trim();

/** Le jeton est vérifié auprès de votre API : sans compte valide, aucune recherche. */
async function verifySession(token: string): Promise<string | null> {
  if (!token) return null;
  const known = sessions.get(token);
  if (known && known.until > Date.now()) return known.userId;

  const base = process.env["API_URL"] ?? process.env["VITE_API_URL"];
  if (!base) return null; // sans adresse d'API, on refuse plutôt que d'ouvrir la fonction à tous
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { id?: unknown };
    if (typeof body.id !== "string") return null;
    sessions.set(token, { userId: body.id, until: Date.now() + MINUTE });
    if (sessions.size > 500) sessions.delete(sessions.keys().next().value as string);
    return body.id;
  } catch {
    return null;
  }
}

function allowUser(userId: string): boolean {
  const now = Date.now();
  const hits = (userHits.get(userId) ?? []).filter((time) => now - time < USER_LIMIT.windowMs);
  if (hits.length >= USER_LIMIT.count) {
    userHits.set(userId, hits);
    return false;
  }
  userHits.set(userId, [...hits, now]);
  if (userHits.size > 1000) userHits.clear();
  return true;
}

function takeBudget(): boolean {
  const day = new Date().toISOString().slice(0, 10);
  if (budget.day !== day) budget = { day, used: 0 };
  if (budget.used >= DAILY_BUDGET) return false;
  budget.used += 1;
  return true;
}

type YoutubeSearch = {
  items?: {
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      channelTitle?: string;
      thumbnails?: { medium?: { url?: string }; high?: { url?: string } };
    };
  }[];
};
type YoutubeError = { error?: { errors?: { reason?: string }[] } };

async function askYoutube(q: string, key: string): Promise<SearchOutcome> {
  const params = new URLSearchParams({
    part: "snippet",
    type: "video",
    maxResults: String(MAX_RESULTS),
    safeSearch: "strict",
    videoEmbeddable: "true", // une vidéo qu'on ne peut pas intégrer ne sert à rien ici
    relevanceLanguage: "fr",
    q,
  });
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params}`, {
      headers: { "x-goog-api-key": key }, // la clé ne passe jamais dans l'adresse
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as YoutubeError;
      if (
        body.error?.errors?.some(
          (item) => item.reason === "quotaExceeded" || item.reason === "dailyLimitExceeded",
        )
      ) {
        blockedUntil = Date.now() + 30 * MINUTE; // on cesse d'insister
        return fail("quota_exceeded");
      }
      return fail("request_failed");
    }
    const json = (await res.json()) as YoutubeSearch;
    const results: VideoResult[] = [];
    for (const item of json.items ?? []) {
      const id = item.id?.videoId;
      if (!id || !VIDEO_ID.test(id)) continue;
      const thumb =
        item.snippet?.thumbnails?.medium?.url ?? item.snippet?.thumbnails?.high?.url ?? "";
      results.push({
        id,
        title: item.snippet?.title ?? "Vidéo",
        channel: item.snippet?.channelTitle ?? "",
        thumbnail: thumb.startsWith("https://i.ytimg.com/")
          ? thumb
          : `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      });
    }
    return { results, error: null };
  } catch {
    return fail("request_failed"); // délai dépassé ou réseau coupé
  }
}

export const searchYoutube = createServerFn({ method: "POST" })
  .inputValidator((d: { q: string; token: string }) =>
    z.object({ q: z.string().trim().min(1).max(120), token: z.string().max(4096) }).parse(d),
  )
  .handler(async ({ data }): Promise<SearchOutcome> => {
    const key = process.env["YOUTUBE_API_KEY"];
    if (!key) return fail("missing_key");

    const userId = await verifySession(data.token);
    if (!userId) return fail("unauthorized");

    const name = normalize(data.q);
    const hit = cache.get(name);
    if (hit && Date.now() - hit.at < CACHE_TTL) return { results: hit.results, error: null };

    const pending = inflight.get(name); // la même demande en cours : on la partage
    if (pending) return pending;

    if (Date.now() < blockedUntil) return fail("quota_exceeded");
    if (!allowUser(userId)) return fail("rate_limited");
    if (!takeBudget()) return fail("quota_exceeded");

    const request = askYoutube(data.q, key)
      .then((outcome) => {
        if (outcome.error === null) {
          cache.set(name, { at: Date.now(), results: outcome.results });
          if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value as string);
        }
        return outcome;
      })
      .finally(() => inflight.delete(name));
    inflight.set(name, request);
    return request;
  });
