// features/videos/components/VideoPlayer.tsx
import { X } from "lucide-react";
import { decode } from "@/components/emimood/utils/youtube";
import { Button } from "@/components/ui/button";
import { isVideoId, type VideoEntry } from "../lib/video";

export function VideoPlayer({ entry, onClose }: { entry: VideoEntry; onClose: () => void }) {
  if (entry.source.type !== "youtube" || !isVideoId(entry.source.id)) return null; // l'identifiant est vérifié avant de construire l'adresse
  return (
    <section className="item-card mb-6" aria-label="Lecteur vidéo">
      <div className="aspect-video overflow-hidden rounded-lg">
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${entry.source.id}?autoplay=1&rel=0&modestbranding=1`}
          title={decode(entry.title)}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
        />
      </div>
      <div className="mt-3 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2>{decode(entry.title)}</h2>
          {entry.channel && <p className="small">{entry.channel}</p>}
        </div>
        <Button variant="ghost" size="icon" aria-label="Fermer le lecteur" onClick={onClose}>
          <X />
        </Button>
      </div>
    </section>
  );
}
