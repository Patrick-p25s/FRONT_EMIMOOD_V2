// features/videos/components/VideoCard.tsx
import { PlayCircle, Video } from "lucide-react";
import { decode } from "@/components/emimood/utils/youtube";
import type { VideoEntry } from "../lib/video";

export function VideoCard({
  entry,
  onPlay,
}: {
  entry: VideoEntry;
  onPlay: (entry: VideoEntry) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onPlay(entry)}
      className="item-card text-left"
      aria-label={`Lire : ${decode(entry.title)}`}
    >
      <div className="relative overflow-hidden rounded-md">
        {entry.thumbnail ? (
          <img
            src={entry.thumbnail}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="grid aspect-video w-full place-items-center bg-muted">
            <Video aria-hidden />
          </div>
        )}
        <PlayCircle
          className="absolute inset-0 m-auto size-12 text-primary-foreground drop-shadow"
          aria-hidden
        />
      </div>
      <h2 className="line-clamp-2 text-base">{decode(entry.title)}</h2>
      {entry.channel && <p className="small">{entry.channel}</p>}
    </button>
  );
}
