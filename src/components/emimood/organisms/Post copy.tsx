import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bookmark,
  ExternalLink,
  FileText,
  Flag,
  Heart,
  Link2,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Publication } from "@/features/enseignant/api/types";
import {
  useLikeMutation,
  useSaveMutation,
  useSignalMutation,
} from "@/features/publication/hooks/usePublicationMutations";
import { useMessageUser } from "@/features/messaging/hooks/useMessageUser";
import { timeAgo } from "@/features/notifications/lib/format";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import { roleLabel } from "@/features/profile/lib/labels";
import { CommentsSection } from "@/features/publications/components/CommentsSection";
import { formatBytes } from "@/features/resources/lib/format";
import { downloadFile } from "@/lib/api/download";
import { errorMessage } from "@/lib/errors";
import { fmtDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  announcement: "Annonce",
  event: "Événement",
  project: "Projet",
  experience: "Expérience",
  resource: "Ressource",
  opportunity: "Opportunité",
};

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

function Body({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > 320 || text.split("\n").length > 6;
  return (
    <>
      <p className={cn("whitespace-pre-line break-words", long && !open && "line-clamp-5")}>
        {text}
      </p>
      {long && (
        <button
          type="button"
          aria-expanded={open}
          className="small font-semibold text-primary hover:underline"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Voir moins" : "Voir plus"}
        </button>
      )}
    </>
  );
}

type PublicationCardProps = { post: Publication; onEdit: () => void; onDelete: () => void };

export function Post({ post, onEdit, onDelete }: PublicationCardProps) {
  const [like, setLike] = useState({ liked: post.liked_by_me, count: post.likes_count });
  const [save, setSave] = useState({ saved: post.saved_by_me, count: post.saves_count });
  const [signaled, setSignaled] = useState(post.signaled_by_me);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(post.comments_count);
  const [downloading, setDownloading] = useState(false);
  const likeMutation = useLikeMutation();
  const saveMutation = useSaveMutation();
  const signalMutation = useSignalMutation();
  const message = useMessageUser();

  // Le fil a été rechargé : on reprend les chiffres du serveur (sauf pendant une action en cours).
  useEffect(() => {
    if (!likeMutation.isPending) setLike({ liked: post.liked_by_me, count: post.likes_count });
    if (!saveMutation.isPending) setSave({ saved: post.saved_by_me, count: post.saves_count });
    setCommentCount(post.comments_count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.liked_by_me, post.likes_count, post.saved_by_me, post.saves_count, post.comments_count]);

  const author = post.author;
  const document = post.document;
  const linkUrl =
    document?.kind === "link" && document.url && /^https?:\/\//i.test(document.url)
      ? document.url
      : null;
  const hidden = post.status === "hidden";

  const download = async () => {
    if (!document || downloading) return;
    setDownloading(true);
    try {
      await downloadFile(`/documents/${document.id}/download`, document.file_name ?? "document");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setDownloading(false);
    }
  };

  const toggleLike = () => {
    const previous = like;
    setLike({ liked: !previous.liked, count: previous.count + (previous.liked ? -1 : 1) });
    likeMutation.mutate(
      { id: post.id, liked: previous.liked },
      {
        onSuccess: (result) => setLike({ liked: result.liked, count: result.likes_count }),
        onError: () => setLike(previous),
      },
    );
  };

  const toggleSave = () => {
    const previous = save;
    setSave({ saved: !previous.saved, count: previous.count + (previous.saved ? -1 : 1) });
    saveMutation.mutate(
      { id: post.id, saved: previous.saved },
      {
        onSuccess: (result) => setSave({ saved: result.saved, count: result.saves_count }),
        onError: () => setSave(previous),
      },
    );
  };

  const sendSignal = () => {
    setSignaled(true);
    signalMutation.mutate(post.id, {
      onSuccess: () => toast.success("Merci, votre signalement a été transmis aux modérateurs."),
      onError: () => setSignaled(false),
    });
  };

  return (
    <article
      className={cn("post", hidden && "opacity-70")}
      aria-label={`Publication de ${author.name}`}
    >
      <div className="post-header">
        <Link
          to="/membres/$userId"
          params={{ userId: author.id }}
          aria-label={`Profil de ${author.name}`}
          className="shrink-0"
        >
          <UserAvatar name={author.name} url={author.avatar_url ?? null} />
        </Link>
        <div className="min-w-0">
          <strong className="flex items-center gap-1">
            <Link
              to="/membres/$userId"
              params={{ userId: author.id }}
              className="truncate text-foreground no-underline hover:underline"
            >
              {author.name}
            </Link>
            {post.publication_type === "announcement" && (
              <BadgeCheck
                className="size-4 shrink-0 text-success"
                aria-label="Annonce officielle"
              />
            )}
          </strong>
          <p className="small">
            {roleLabel(author.role)} ·{" "}
            <time dateTime={post.created_at} title={fmtDateTime(post.created_at)}>
              {timeAgo(post.created_at)}
            </time>
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="more"
              size="icon"
              variant="ghost"
              aria-label={`Options de la publication de ${author.name}`}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!post.is_mine && (
              <DropdownMenuItem asChild>
                <Link to="/membres/$userId" params={{ userId: author.id }}>
                  <UserRound /> Voir le profil
                </Link>
              </DropdownMenuItem>
            )}
            {!post.is_mine && message.allowed && (
              <DropdownMenuItem
                disabled={message.pending}
                onClick={() => void message.open(author.id)}
              >
                <MessageSquare /> Envoyer un message
              </DropdownMenuItem>
            )}
            {post.is_mine ? (
              <>
                <DropdownMenuItem onClick={onEdit}>
                  <Pencil /> Modifier
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete}>
                  <Trash2 /> Supprimer
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={signaled || signalMutation.isPending}
                  onClick={sendSignal}
                >
                  <Flag /> {signaled ? "Signalement envoyé" : "Signaler"}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="post-content">
        <div className="flex items-center gap-2">
          <span className={cn("tag", post.publication_type === "project" && "warm")}>
            {TYPE_LABEL[post.publication_type] ?? post.publication_type}
          </span>
          {hidden && <span className="tag warm">Masquée</span>}
        </div>
        <h3 className="mt-3">{post.title}</h3>
        <Body text={post.content} />

        {document?.kind === "file" && (
          <button
            type="button"
            className="attachment w-full text-left text-foreground"
            disabled={downloading}
            onClick={() => void download()}
          >
            <FileText size={25} />
            <div className="min-w-0">
              <strong className="block truncate text-xs">{document.file_name}</strong>
              <p className="small">
                {document.is_official ? "Document officiel" : "Document partagé"}
                {document.file_size != null && ` · ${formatBytes(document.file_size)}`}
                {downloading && " · Téléchargement…"}
              </p>
            </div>
          </button>
        )}
        {linkUrl && (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="attachment text-foreground no-underline"
          >
            <Link2 size={25} />
            <div className="min-w-0">
              <strong className="block truncate text-xs">{document?.title ?? linkUrl}</strong>
              <p className="small flex items-center gap-1">
                {new URL(linkUrl).hostname} <ExternalLink size={12} aria-hidden />
              </p>
            </div>
          </a>
        )}
      </div>

      <div className="post-counts">
        <span>
          {like.count > 0
            ? `♥ ${plural(like.count, "personne aime", "personnes aiment")}`
            : "Soyez le premier à aimer"}
        </span>
        <button
          type="button"
          className="hover:underline"
          onClick={() => setCommentsOpen((open) => !open)}
        >
          {plural(commentCount, "commentaire", "commentaires")}
        </button>
      </div>

      <div className="post-actions">
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={like.liked}
          disabled={likeMutation.isPending}
          onClick={toggleLike}
          className={cn(like.liked && "text-primary")}
        >
          <Heart className={cn("size-4", like.liked && "fill-current")} aria-hidden /> J’aime
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={commentsOpen}
          onClick={() => setCommentsOpen((open) => !open)}
        >
          <MessageCircle className="size-4" aria-hidden /> Commenter
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={save.saved}
          disabled={saveMutation.isPending}
          className={save.saved ? "engaged" : ""}
          onClick={toggleSave}
        >
          <Bookmark fill={save.saved ? "currentColor" : "none"} />{" "}
          {save.saved ? "Enregistré" : "Enregistrer"}
        </Button>
      </div>

      {commentsOpen && (
        <CommentsSection
          publicationId={post.id}
          onAdded={() => setCommentCount((count) => count + 1)}
        />
      )}
    </article>
  );
}
