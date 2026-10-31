// features/publications/components/CommentsSection.tsx
import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CornerDownRight, X } from "lucide-react";
import { ErrorState } from "@/components/emimood/molecules/states";
import { roleLabel } from "@/features/profile/lib/labels";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { fmtDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { PubComment } from "../api/commentSchemas";
import { timeAgo } from "@/features/notification/lib/format";
import { useAddComment, useComments } from "../hooks/useComment";
import { UserAvatar } from "@/features/profile/components/UserAvatar";

const MAX = 2000;

function CommentItem({
  comment,
  onReply,
  nested,
}: {
  comment: PubComment;
  onReply: (comment: PubComment) => void;
  nested?: boolean;
}) {
  const { author } = comment;
  return (
    <li className={cn("flex gap-2.5", nested && "ml-9 border-l pl-3")}>
      <Link
        to="/membres/$userId"
        params={{ userId: author.id }}
        aria-label={`Profil de ${author.name}`}
        className="shrink-0"
      >
        <UserAvatar name={author.name} url={author.avatar_url ?? null} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
          <p className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
            <Link
              to="/membres/$userId"
              params={{ userId: author.id }}
              className="font-semibold text-foreground no-underline hover:underline"
            >
              {author.name}
            </Link>
            {author.role !== "student" && <span className="tag">{roleLabel(author.role)}</span>}
            {comment.is_mine && <span className="tag">Vous</span>}
          </p>
          <p className="whitespace-pre-line wrap-break-word">{comment.content}</p>
        </div>
        <p className="small mt-0.5 flex items-center gap-3 px-1">
          <time dateTime={comment.created_at} title={fmtDateTime(comment.created_at)}>
            {timeAgo(comment.created_at)}
          </time>
          <button
            type="button"
            className="font-semibold hover:underline"
            onClick={() => onReply(comment)}
          >
            Répondre
          </button>
        </p>
      </div>
    </li>
  );
}

export function CommentsSection({
  publicationId,
  onAdded,
}: {
  publicationId: string;
  onAdded: () => void;
}) {
  const query = useComments(publicationId);
  const add = useAddComment(publicationId);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<PubComment | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  const all = query.data?.pages.flatMap((page) => page.items) ?? [];
  const known = new Set(all.map((comment) => comment.id));
  const roots = all.filter((comment) => !comment.parent_id || !known.has(comment.parent_id));
  const repliesOf = (id: string) => all.filter((comment) => comment.parent_id === id);

  const content = text.trim();

  const submit = async () => {
    if (!content || add.isPending) return;
    try {
      // Les fils ont un seul niveau : répondre à une réponse rattache au commentaire d'origine.
      await add.mutateAsync({
        content,
        parentId: replyTo ? (replyTo.parent_id ?? replyTo.id) : undefined,
      });
      setText("");
      setReplyTo(null);
      onAdded();
    } catch {
      // message déjà affiché par la mutation : le texte reste dans le champ
    }
  };

  const reply = (comment: PubComment) => {
    setReplyTo(comment);
    field.current?.focus();
  };

  return (
    <div className="mt-3 grid gap-3 border-t pt-3">
      {query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.isLoading ? (
        <Skeleton className="h-12 w-full" />
      ) : roots.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun commentaire. Soyez le premier.</p>
      ) : (
        <ul className="grid gap-3">
          {roots.map((comment) => (
            <li key={comment.id} className="grid gap-2">
              <ul>
                <CommentItem comment={comment} onReply={reply} />
              </ul>
              {repliesOf(comment.id).length > 0 && (
                <ul className="grid gap-2">
                  {repliesOf(comment.id).map((child) => (
                    <CommentItem key={child.id} comment={child} onReply={reply} nested />
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {query.hasNextPage && (
        <Button
          variant="ghost"
          size="sm"
          className="mx-auto"
          disabled={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
        >
          {query.isFetchingNextPage ? "Chargement…" : "Voir plus de commentaires"}
        </Button>
      )}

      {replyTo && (
        <p className="small flex items-center gap-2">
          <CornerDownRight size={14} aria-hidden />
          <span className="min-w-0 flex-1 truncate">
            Réponse à <strong>{replyTo.author.name}</strong>
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            aria-label="Annuler la réponse"
            onClick={() => setReplyTo(null)}
          >
            <X className="size-3.5" aria-hidden />
          </Button>
        </p>
      )}

      <div className="flex items-end gap-2">
        <Textarea
          ref={field}
          rows={2}
          maxLength={MAX}
          placeholder={replyTo ? "Écrire une réponse…" : "Écrire un commentaire…"}
          aria-label="Votre commentaire"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              void submit();
            }
          }}
        />
        <Button onClick={() => void submit()} disabled={add.isPending || content === ""}>
          {add.isPending ? "Envoi…" : replyTo ? "Répondre" : "Commenter"}
        </Button>
      </div>
      {text.length > MAX - 200 && (
        <p className="small text-right">
          {text.length} / {MAX}
        </p>
      )}
    </div>
  );
}
