// components/CommentsSection.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { fmtDateTime } from "@/lib/format";
import { useAddComment } from "../hooks/usePublicationMutations";
import { useComments } from "../hooks/usePublications";

export function CommentsSection({
  publicationId,
  onAdded,
}: {
  publicationId: string;
  onAdded: () => void;
}) {
  const comments = useComments(publicationId, true);
  const add = useAddComment(publicationId);
  const [text, setText] = useState("");

  const submit = async () => {
    const content = text.trim();
    if (!content) return;
    try {
      await add.mutateAsync(content);
      setText("");
      onAdded();
    } catch {
      // message déjà affiché par la mutation
    }
  };

  return (
    <div className="mt-3 grid gap-3 border-t pt-3">
      {comments.isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : (comments.data ?? []).length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucun commentaire. Soyez le premier.</p>
      ) : (
        <ul className="grid gap-2">
          {(comments.data ?? []).map((comment) => (
            <li key={comment.id} className="rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{comment.author.name}</span> ·{" "}
                {fmtDateTime(comment.created_at)}
              </p>
              <p className="whitespace-pre-line">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-end gap-2">
        <Textarea
          rows={2}
          placeholder="Écrire un commentaire…"
          aria-label="Votre commentaire"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <Button onClick={() => void submit()} disabled={add.isPending || text.trim() === ""}>
          Commenter
        </Button>
      </div>
    </div>
  );
}
