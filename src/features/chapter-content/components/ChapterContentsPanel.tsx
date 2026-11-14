// features/chapter-content/components/ChapterContentsPanel.tsx
import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { MAX_BLOCK } from "../api/schemas";
import { useChapterContent, useChapterContentMutations } from "../hooks/useChapterContent";
import { MarkdownBlock } from "./MarkDownBlock";

type EditorProps = {
  initial?: string;
  submitLabel: string;
  pending: boolean;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
};

function BlockEditor({ initial = "", submitLabel, pending, onSubmit, onCancel }: EditorProps) {
  const [text, setText] = useState(initial);
  const [preview, setPreview] = useState(false);
  const trimmed = text.trim();
  return (
    <form
      className="grid gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (trimmed) onSubmit(trimmed);
      }}
    >
      {preview ? (
        <div className="chapter-content min-h-24 rounded-md border p-3">
          {trimmed ? (
            <MarkdownBlock source={trimmed} />
          ) : (
            <p className="small">Rien à prévisualiser.</p>
          )}
        </div>
      ) : (
        <Textarea
          value={text}
          rows={6}
          maxLength={MAX_BLOCK}
          aria-label="Contenu du chapitre"
          placeholder="Écrivez le contenu. Markdown accepté : # titre, **gras**, - liste"
          onChange={(event) => setText(event.target.value)}
        />
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" className="small underline" onClick={() => setPreview((p) => !p)}>
          {preview ? "Modifier" : "Aperçu"}
        </button>
        <span className="small">
          {text.length} / {MAX_BLOCK}
        </span>
        <div className="flex gap-2">
          {onCancel && (
            <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
              Annuler
            </Button>
          )}
          <Button type="submit" size="sm" disabled={pending || !trimmed}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}

export function ChapterContentsPanel({ chapterId }: { chapterId: string }) {
  const contents = useChapterContent(chapterId);
  const { create, update } = useChapterContentMutations(chapterId);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  if (contents.isLoading) return <Skeleton className="h-16 w-full" />;
  if (contents.isError) {
    return (
      <p className="small">
        Le contenu n’a pas pu être chargé.{" "}
        <button type="button" className="underline" onClick={() => void contents.refetch()}>
          Réessayer
        </button>
      </p>
    );
  }
  const blocks = contents.data ?? [];

  return (
    <section aria-label="Contenu du chapitre" className="grid gap-3">
      <h4 className="text-sm font-semibold">Contenu</h4>
      {blocks.length === 0 && !adding && <p className="small">Aucun contenu pour ce chapitre.</p>}

      {blocks.map((block) =>
        editingId === block.id ? (
          <BlockEditor
            key={block.id}
            initial={block.content}
            submitLabel="Enregistrer"
            pending={update.isPending}
            onCancel={() => setEditingId(null)}
            onSubmit={async (content) => {
              try {
                await update.mutateAsync({ id: block.id, content });
                setEditingId(null);
              } catch {
                // message déjà affiché par la mutation
              }
            }}
          />
        ) : (
          <div key={block.id} className="rounded-md border p-3">
            <div className="chapter-content">
              <MarkdownBlock source={block.content} />
            </div>
            <div className="mt-2 flex justify-end">
              <Button size="sm" variant="ghost" onClick={() => setEditingId(block.id)}>
                <Pencil /> Modifier
              </Button>
            </div>
          </div>
        ),
      )}

      {adding ? (
        <BlockEditor
          submitLabel="Ajouter"
          pending={create.isPending}
          onCancel={() => setAdding(false)}
          onSubmit={async (text) => {
            try {
              await create.mutateAsync([text]);
              setAdding(false);
            } catch {
              // message déjà affiché par la mutation
            }
          }}
        />
      ) : (
        <Button variant="outline" size="sm" className="w-fit" onClick={() => setAdding(true)}>
          <Plus /> Ajouter un bloc
        </Button>
      )}
    </section>
  );
}
