// features/resources/components/ChapterSupportsPanel.tsx
import { useState } from "react";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { ErrorState } from "@/components/emimood/molecules/states";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { ResourceDoc } from "../api/schemas";
import { useChapterDocuments, useResourceMutations, useToggleSave } from "../hooks/useResources";
import { AddDocumentDialog } from "./AddDocumentDialog";
import { EditResourceDialog } from "./EditResourceDialog";
import { ResourcePreviewDialog } from "./ResourcePreviewDialog";
import { ResourceRow } from "./ResourceRows";

export function ChapterSupportsPanel({ chapterId }: { chapterId: string }) {
  const query = useChapterDocuments(chapterId);
  const toggleSave = useToggleSave();
  const { remove } = useResourceMutations();
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<ResourceDoc | null>(null);
  const [editing, setEditing] = useState<ResourceDoc | null>(null);
  const [removing, setRemoving] = useState<ResourceDoc | null>(null);
  const items = query.data ?? [];

  return (
    <section aria-label="Supports de cours" className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">Supports de cours</h3>
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus /> Ajouter
        </Button>
      </div>

      {query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.isLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : items.length === 0 ? (
        <p className="empty">Aucun support pour ce chapitre. Ajoutez un fichier ou un lien.</p>
      ) : (
        <div className="document-list">
          {items.map((doc) => (
            <ResourceRow
              key={doc.id}
              doc={doc}
              onOpen={setSelected}
              onToggleSave={(item) => toggleSave.mutate({ id: item.id, saved: item.saved })}
              menu={
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" aria-label={`Options pour ${doc.title}`}>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setEditing(doc)}>
                      <Pencil /> Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setRemoving(doc)}>
                      <Trash2 /> Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              }
            />
          ))}
        </div>
      )}

      <AddDocumentDialog
        open={adding}
        onOpenChange={setAdding}
        target={{ kind: "chapter", chapterId }}
      />
      <ResourcePreviewDialog doc={selected} onClose={() => setSelected(null)} />
      <EditResourceDialog doc={editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={`Supprimer « ${removing?.title ?? ""} » ?`}
        description="Les étudiants ne le verront plus. Cette action est définitive."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!removing) return;
          try {
            await remove.mutateAsync(removing.id);
            setRemoving(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </section>
  );
}
