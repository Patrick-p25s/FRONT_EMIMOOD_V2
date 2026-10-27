// components/PublicationsPage.tsx : le fil complet, partagé entre espaces
import { useState } from "react";
import { Plus } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";

import { PublicationForm, type ClassOption, type SubjectOption } from "./PublicationForm";
import { Post } from "@/components/emimood/organisms/Post copy";
import type { Publication, PublicationType } from "@/features/enseignant/api/types";
import { usePublicationMutations } from "@/features/publication/hooks/usePublicationMutations";
import { usePublicationFeed } from "@/features/publication/hooks/usePublications";
import { PUB_TYPES } from "@/features/enseignant/lib/meta";

type Dialogs = { kind: "create" } | { kind: "edit"; publication: Publication } | null;

type PublicationsPageProps = {
  classes: ClassOption[];
  subjects: SubjectOption[];
  title?: string;
  description?: string;
};

export function PublicationsPage({
  classes,
  subjects,
  title = "Annonces",
  description = "Publiez et suivez les annonces, événements, projets et ressources.",
}: PublicationsPageProps) {
  const { user } = useAuth();
  const { remove } = usePublicationMutations();
  const [type, setType] = useState<PublicationType | undefined>(undefined);
  const [mine, setMine] = useState(false);
  const [dialog, setDialog] = useState<Dialogs>(null);
  const [deleting, setDeleting] = useState<Publication | null>(null);

  const feed = usePublicationFeed({ type, authorId: mine && user ? user.id : undefined });
  const items = feed.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <>
      <PageHeader title={title} description={description} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filtrer les publications">
          <Button
            size="sm"
            variant={type === undefined ? "default" : "outline"}
            onClick={() => setType(undefined)}
          >
            Tout
          </Button>
          {Object.entries(PUB_TYPES).map(([value, meta]) => (
            <Button
              key={value}
              size="sm"
              variant={type === value ? "default" : "outline"}
              onClick={() => setType(value as PublicationType)}
            >
              {meta.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mine ? "default" : "outline"}
            aria-pressed={mine}
            onClick={() => setMine((value) => !value)}
          >
            Mes publications
          </Button>
          <Button onClick={() => setDialog({ kind: "create" })}>
            <Plus className="size-4" aria-hidden /> Publier
          </Button>
        </div>
      </div>

      {feed.error ? (
        <ErrorState error={feed.error} onRetry={() => void feed.refetch()} />
      ) : feed.isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : items.length === 0 ? (
        <EmptyState
          title="Aucune publication"
          description="Changez de filtre, ou publiez la première."
          action={<Button onClick={() => setDialog({ kind: "create" })}>Publier</Button>}
        />
      ) : (
        <div className="grid gap-3">
          {items.map((publication) => (
            <Post
              key={publication.id}
              post={publication}
              onEdit={() => setDialog({ kind: "edit", publication })}
              onDelete={() => setDeleting(publication)}
            />
          ))}
          {feed.hasNextPage && (
            <Button
              variant="outline"
              className="mx-auto"
              disabled={feed.isFetchingNextPage}
              onClick={() => void feed.fetchNextPage()}
            >
              {feed.isFetchingNextPage ? "Chargement…" : "Voir plus"}
            </Button>
          )}
        </div>
      )}

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {dialog?.kind === "edit" ? "Modifier la publication" : "Nouvelle publication"}
            </DialogTitle>
          </DialogHeader>
          {dialog && (
            <PublicationForm
              key={dialog.kind === "edit" ? dialog.publication.id : "new"}
              classes={classes}
              subjects={subjects}
              publication={dialog.kind === "edit" ? dialog.publication : undefined}
              onDone={() => setDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Supprimer cette publication ?"
        description="Elle disparaît pour tout le monde, avec ses commentaires."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await remove.mutateAsync(deleting.id);
            setDeleting(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </>
  );
}
