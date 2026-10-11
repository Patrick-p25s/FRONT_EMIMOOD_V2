import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Link2, PlayCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/emimood/molecules/Heading";
import { searchYoutube, type VideoResult } from "@/lib/youtube.functions";
import { decode, extractId } from "@/components/emimood/utils/youtube";

export function VideosPage() {
  const search = useServerFn(searchYoutube);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<VideoResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState<VideoResult | null>(null);
  async function run(e: React.FormEvent) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    const id = extractId(value);
    if (id) {
      setPlaying({ id, title: "Vidéo YouTube", channel: "", thumbnail: "" });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const r = await search({ data: { q: value } });
      setResults(r.results);
      setError(r.error);
    } catch {
      setError("request_failed");
    }
    setLoading(false);
  }
  return (
    <div className="page">
      <Heading
        title="Vidéos"
        subtitle="Recherchez et regardez des vidéos YouTube sans quitter EMIMood."
      />
      <form onSubmit={run} className="flex gap-2 mb-5 max-w-xl">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ex. : jointures SQL, introduction à React… ou collez un lien YouTube"
          aria-label="Rechercher une vidéo"
        />
        <Button type="submit" disabled={loading}>
          <Search />
          {loading ? "Recherche…" : "Rechercher"}
        </Button>
      </form>
      {playing && (
        <div className="item-card mb-6">
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1`}
              title={playing.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
          <h2 className="mt-3">{decode(playing.title)}</h2>
          <p className="small">{playing.channel}</p>
        </div>
      )}
      {error === "missing_key" && (
        <p className="empty">
          <Link2 className="mx-auto mb-2" />
          La recherche YouTube n’est pas encore activée (clé YouTube à configurer). Vous pouvez déjà
          coller un lien YouTube pour le regarder ici.
        </p>
      )}
      {error === "request_failed" && (
        <p className="empty">La recherche a échoué. Réessayez dans un instant.</p>
      )}
      <div className="content-grid">
        {results.map((v) => (
          <button
            key={v.id}
            onClick={() => {
              setPlaying(v);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="item-card text-left"
          >
            <div className="relative rounded-md overflow-hidden">
              <img
                src={v.thumbnail}
                alt=""
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
              <PlayCircle className="absolute inset-0 m-auto size-12 text-primary-foreground drop-shadow" />
            </div>
            <h2 className="text-base line-clamp-2">{decode(v.title)}</h2>
            <p className="small">{v.channel}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
