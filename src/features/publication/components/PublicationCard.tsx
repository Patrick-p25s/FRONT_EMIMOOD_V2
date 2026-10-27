// components/PublicationCard.tsx
import { useState } from "react";
import {
  Eye,
  EyeOff,
  ExternalLink,
  Heart,
  MapPin,
  MessageCircle,
  Paperclip,
  Pencil,
  Trash2,
  Download,
} from "lucide-react";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fmtDateTime } from "@/lib/format";
import { CommentsSection } from "./CommentsSection";
import { toast } from "sonner";
import { errorMessage } from "@/lib/errors";
import { downloadFile } from "@/lib/api/download";
import { formatBytes } from "@/lib/files";
import { Publication } from "@/features/enseignant/api/types";
import { PUB_TYPES, ROLE_LABEL } from "@/features/enseignant/lib/meta";
import {
  useLikeMutation,
  usePublicationMutations,
  useSaveMutation,
  useSignalMutation,
} from "@/features/publication/hooks/usePublicationMutations";

type PublicationCardProps = { publication: Publication; onEdit: () => void; onDelete: () => void };

export function PublicationCard({ publication, onEdit, onDelete }: PublicationCardProps) {
  const meta = PUB_TYPES[publication.publication_type];
  const { setStatus } = usePublicationMutations();
  const likeMutation = useLikeMutation();
  const saveMutation = useSaveMutation();
  const signalMutation = useSignalMutation();
  const [like, setLike] = useState({
    liked: publication.liked_by_me,
    count: publication.likes_count,
  });

  const [save, setSave] = useState({
    saved: publication.liked_by_me,
    count: publication.saves_count,
  });

  const [signal, setSignal] = useState({
    signaled: publication.signaled_by_me,
    count: publication.signals_count,
  });
  const [commentsCount, setCommentsCount] = useState(publication.comments_count);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const hidden = publication.status === "hidden";
  const document = publication.document;

  const download = async () => {
    if (!document) return;
    setDownloading(true);
    try {
      await downloadFile(`/documents/${document.id}/download`, document.file_name ?? "document");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };
  const toggleLike = () => {
    const previous = like;
    setLike({ liked: !previous.liked, count: previous.count + (previous.liked ? -1 : 1) });
    likeMutation.mutate(
      { id: publication.id, liked: previous.liked },
      {
        onSuccess: (result) => setLike({ liked: result.liked, count: result.likes_count }),
        onError: () => setLike(previous),
      },
    );
  };

  return (
    <article
      className={cn("rounded-xl border bg-card p-4 shadow-(--shadow)", hidden && "opacity-70")}
    >
      <header className="flex items-start gap-3">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary"
          aria-hidden
        >
          {publication.author.name.slice(0, 1).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{publication.author.name}</p>
          <p className="text-xs text-muted-foreground">
            {ROLE_LABEL[publication.author.role]} · {fmtDateTime(publication.created_at)} ·{" "}
            {publication.visibility === "class" ? "Ma classe" : "Toute l’université"}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
          {hidden && <StatusPill tone="muted">Masquée</StatusPill>}
          <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
        </div>
      </header>

      <div className="mt-3 grid gap-2">
        {publication.title && <h3 className="text-base font-bold">{publication.title}</h3>}
        <p className="whitespace-pre-line text-sm">{publication.content}</p>

        {publication.event_at && (
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg bg-muted/50 px-3 py-2 text-sm">
            <span className="font-medium">{fmtDateTime(publication.event_at)}</span>
            {publication.event_location && (
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <MapPin className="size-3.5" aria-hidden /> {publication.event_location}
              </span>
            )}
          </p>
        )}

        {document?.kind === "link" && document.url && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-primary no-underline hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden /> Ouvrir le lien
          </a>
        )}
        {document?.kind === "file" && (
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            disabled={downloading}
            onClick={() => void download()}
          >
            <Download className="size-4" aria-hidden />
            {downloading ? "Téléchargement…" : (document.file_name ?? "Télécharger")}
            {document.file_size ? (
              <span className="text-muted-foreground">· {formatBytes(document.file_size)}</span>
            ) : null}
          </Button>
        )}
      </div>

      <footer className="mt-3 flex items-center justify-between gap-2 border-t pt-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={like.liked}
            onClick={toggleLike}
            className={cn(like.liked && "text-primary")}
          >
            <Heart className={cn("size-4", like.liked && "fill-current")} aria-hidden />{" "}
            {like.count}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={commentsOpen}
            onClick={() => setCommentsOpen((open) => !open)}
          >
            <MessageCircle className="size-4" aria-hidden /> {commentsCount}
          </Button>
        </div>

        {publication.is_mine && (
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Modifier la publication"
              onClick={onEdit}
            >
              <Pencil className="size-4" aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={hidden ? "Afficher la publication" : "Masquer la publication"}
              disabled={setStatus.isPending}
              onClick={() =>
                setStatus.mutate({ id: publication.id, status: hidden ? "published" : "hidden" })
              }
            >
              {hidden ? (
                <Eye className="size-4" aria-hidden />
              ) : (
                <EyeOff className="size-4" aria-hidden />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Supprimer la publication"
              onClick={onDelete}
            >
              <Trash2 className="size-4" aria-hidden />
            </Button>
          </div>
        )}
      </footer>

      {commentsOpen && (
        <CommentsSection
          publicationId={publication.id}
          onAdded={() => setCommentsCount((count) => count + 1)}
        />
      )}
    </article>
  );
}
