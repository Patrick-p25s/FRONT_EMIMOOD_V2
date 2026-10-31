// features/videos/hooks/useVideos.ts
import { useQueries, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { refreshTokens } from "@/lib/api/client";
import { tokenStore } from "@/lib/api/tokenStore";
import { searchYoutube, type SearchOutcome } from "@/lib/youtube.functions";
import { extractId } from "@/components/emimood/utils/youtube";
import { isVideoId, safeThumb, thumbOf, type VideoEntry } from "../lib/video";
import { retryPolicy } from "@/lib/api/message";
import { resourcesApi } from "@/features/resource/api/resource";

const DAY = 24 * 60 * 60 * 1000;

type Search = (input: { data: { q: string; token: string } }) => Promise<SearchOutcome>;

/** Envoie la recherche avec le jeton de session. S'il a expiré, on le renouvelle une fois et on réessaie. */
async function ask(search: Search, q: string): Promise<SearchOutcome> {
  const call = () => search({ data: { q, token: tokenStore.getAccess() ?? "" } });
  const first = await call();
  if (first.error !== "unauthorized") return first;
  await refreshTokens();
  return call();
}

const toEntry = (v: {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
}): VideoEntry => ({
  key: v.id,
  title: v.title,
  channel: v.channel,
  thumbnail: safeThumb(v.thumbnail, v.id),
  source: { type: "youtube", id: v.id },
});

/** Vidéos déposées par les enseignants : liens YouTube et fichiers vidéo. Aucun quota YouTube. */
export const useCourseVideos = () =>
  useQuery({
    queryKey: ["videos", "course"],
    staleTime: 5 * 60_000,
    retry: retryPolicy,
    queryFn: async (): Promise<VideoEntry[]> => {
      const [links, files] = await Promise.all([
        resourcesApi.list({ q: "", media: "link" }, 1),
        resourcesApi.list({ q: "", media: "video" }, 1),
      ]);
      const entries: VideoEntry[] = [];
      for (const doc of links.items) {
        const id = doc.url ? extractId(doc.url) : null;
        if (!id || !isVideoId(id)) continue;
        entries.push({
          key: doc.id,
          title: doc.title,
          channel: [doc.subject?.name, doc.owner?.name].filter(Boolean).join(" · "),
          thumbnail: thumbOf(id),
          source: { type: "youtube", id },
        });
      }
      for (const doc of files.items) {
        entries.push({
          key: doc.id,
          title: doc.title,
          channel: [doc.subject?.name, doc.owner?.name].filter(Boolean).join(" · "),
          thumbnail: null,
          source: { type: "file", doc },
        });
      }
      return entries;
    },
  });

/** Suggestions pour les deux premières matières : mises en cache 24 h. */
export function useSubjectSuggestions(subjects: { id: string; name: string }[]) {
  const search = useServerFn(searchYoutube);
  return useQueries({
    queries: subjects.slice(0, 2).map((subject) => ({
      queryKey: ["videos", "suggest", subject.name.toLowerCase()],
      staleTime: DAY,
      gcTime: DAY,
      retry: 0,
      queryFn: async () => {
        const response = await ask(search, `${subject.name} cours`); // ← changé
        if (response.error) throw new Error(response.error);
        return { subject: subject.name, items: response.results.slice(0, 4).map(toEntry) };
      },
    })),
  });
}

export function useVideoSearch(term: string) {
  const search = useServerFn(searchYoutube);
  return useQuery({
    queryKey: ["videos", "search", term.toLowerCase()],
    enabled: term !== "",
    staleTime: DAY,
    retry: 0,
    queryFn: async () => {
      const response = await ask(search, term);
      if (response.error) throw new Error(response.error);
      return response.results.filter((v) => isVideoId(v.id)).map(toEntry);
    },
  });
}
