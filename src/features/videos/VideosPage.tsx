// features/videos/pages/VideosPage.tsx
import { useState, type FormEvent } from "react";
import { Link2, Search } from "lucide-react";
import { Heading } from "@/components/emimood/molecules/Heading";
import { extractId } from "@/components/emimood/utils/youtube";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoCard } from "./components/VideoCard";
import { VideoPlayer } from "./components/VideoPlayer";
import { useCourseVideos, useSubjectSuggestions, useVideoSearch } from "./hooks/useVideos";
import { isVideoId, thumbOf, type VideoEntry } from "./lib/video";
import { ResourceDoc } from "../resource/api/schemas";
import { ResourcePreviewDialog } from "../resource/components/ResourcePreviewDialog";

const SEARCH_ERRORS: Record<string, string> = {
  missing_key:
    "La recherche YouTube n’est pas encore activée. Vous pouvez déjà coller un lien YouTube pour le regarder ici.",
  request_failed: "La recherche a échoué. Réessayez dans un instant.",
  unauthorized: "Votre session a expiré. Reconnectez-vous pour rechercher des vidéos.",
  rate_limited: "Trop de recherches d’affilée. Patientez quelques minutes.",
  quota_exceeded:
    "La recherche de vidéos est saturée pour aujourd’hui. Vous pouvez toujours coller un lien YouTube.",
};

function Grid({ entries, onPlay }: { entries: VideoEntry[]; onPlay: (entry: VideoEntry) => void }) {
  return (
    <div className="content-grid">
      {entries.map((entry) => (
        <VideoCard key={entry.key} entry={entry} onPlay={onPlay} />
      ))}
    </div>
  );
}

export function VideosPage({ subjects }: { subjects: { id: string; name: string }[] }) {
  const [input, setInput] = useState("");
  const [term, setTerm] = useState("");
  const [playing, setPlaying] = useState<VideoEntry | null>(null);
  const [fileDoc, setFileDoc] = useState<ResourceDoc | null>(null);

  const course = useCourseVideos();
  const suggestions = useSubjectSuggestions(subjects);
  const results = useVideoSearch(term);

  const play = (entry: VideoEntry) => {
    if (entry.source.type === "file") return setFileDoc(entry.source.doc);
    setPlaying(entry);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const value = input.trim().slice(0, 200);
    if (!value) return;
    const id = extractId(value);
    if (id && isVideoId(id)) {
      setTerm("");
      return play({
        key: `link-${id}`,
        title: "Vidéo YouTube",
        channel: "",
        thumbnail: thumbOf(id),
        source: { type: "youtube", id },
      });
    }
    setTerm(value);
  };

  const suggestionRows = suggestions.flatMap((query) => (query.data ? [query.data] : []));
  const suggestionsLoading = suggestions.some((query) => query.isLoading);

  return (
    <div className="page">
      <Heading
        title="Vidéos"
        subtitle="Les vidéos de vos cours, et la recherche YouTube sans quitter EMIMood."
      />

      <form onSubmit={submit} className="mb-5 flex max-w-xl gap-2" role="search">
        <Input
          value={input}
          maxLength={200}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ex. : jointures SQL, introduction à React… ou collez un lien YouTube"
          aria-label="Rechercher une vidéo"
        />
        <Button type="submit" disabled={results.isFetching}>
          <Search />
          {results.isFetching ? "Recherche…" : "Rechercher"}
        </Button>
      </form>

      {playing && <VideoPlayer entry={playing} onClose={() => setPlaying(null)} />}

      {term && (
        <section className="mb-8" aria-label="Résultats">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Résultats pour « {term} »</h2>
            <Button variant="ghost" size="sm" onClick={() => setTerm("")}>
              Effacer
            </Button>
          </div>
          {results.isLoading ? (
            <div className="content-grid">
              {[0, 1, 2, 3].map((key) => (
                <Skeleton key={key} className="h-48 w-full" />
              ))}
            </div>
          ) : results.error ? (
            <p className="empty">
              <Link2 className="mx-auto mb-2" />
              {SEARCH_ERRORS[results.error.message] ?? SEARCH_ERRORS["request_failed"]}
            </p>
          ) : (results.data ?? []).length === 0 ? (
            <p className="empty">Aucune vidéo trouvée.</p>
          ) : (
            <Grid entries={results.data ?? []} onPlay={play} />
          )}
        </section>
      )}

      <section className="mb-8" aria-label="Dans vos cours">
        <h2 className="mb-4 text-lg font-semibold">Dans vos cours</h2>
        {course.isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (course.data ?? []).length === 0 ? (
          <p className="empty">
            Vos enseignants n’ont pas encore ajouté de vidéo. Ils peuvent coller un lien YouTube
            dans les supports d’un chapitre.
          </p>
        ) : (
          <Grid entries={course.data ?? []} onPlay={play} />
        )}
      </section>

      {!term &&
        suggestionRows.map((row) => (
          <section
            key={row.subject}
            className="mb-8"
            aria-label={`Suggestions pour ${row.subject}`}
          >
            <h2 className="mb-4 text-lg font-semibold">Pour {row.subject}</h2>
            <Grid entries={row.items} onPlay={play} />
          </section>
        ))}
      {!term && suggestionsLoading && <Skeleton className="h-48 w-full" />}

      <ResourcePreviewDialog doc={fileDoc} onClose={() => setFileDoc(null)} />
    </div>
  );
}
