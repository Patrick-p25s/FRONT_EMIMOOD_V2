// features/publications/components/CampusFeed.tsx
import { useState } from "react";
import { FileText, Link2, Plus, Rocket } from "lucide-react";
import { Avatar } from "@/components/emimood/atoms/Avatar";
import { ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import type { Publication, PublicationType } from "../api/types";
import { usePublicationFeed } from "../hooks/usePublications";
import { PublicationCard } from "./PublicationCard";
import { PublicationDialogs, type PublicationDialog } from "./PublicationDialogs";
import type { ClassOption, SubjectOption } from "./PublicationForm";
import { initials } from "@/lib/format";

const TABS: { label: string; type: PublicationType | undefined }[] = [
  { label: "Pour vous", type: undefined },
  { label: "Annonces", type: "announcement" },
  { label: "Projets", type: "project" },
];

type CampusFeedProps = { classes: ClassOption[]; subjects: SubjectOption[]; compact?: boolean };

export function CampusFeed({ classes, subjects, compact = false }: CampusFeedProps) {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "";
  const [type, setType] = useState<PublicationType | undefined>(undefined);
  const [dialog, setDialog] = useState<PublicationDialog>(null);
  const [deleting, setDeleting] = useState<Publication | null>(null);

  const feed = usePublicationFeed({ type });
  const items = feed.data?.pages.flatMap((page) => page.items) ?? [];
  const visible = compact ? items.slice(0, 2) : items;

  return (
    <>
      <div className="composer">
        <div className="composer-top">
          <Avatar initials={user ? initials(user.name) : ""} />
          <Button
            variant="ghost"
            className="composer-trigger"
            onClick={() => setDialog({ kind: "create" })}
          >
            Qu’avez-vous envie de partager{firstName ? `, ${firstName}` : ""} ?
          </Button>
        </div>
        <div className="composer-actions">
          <div className="tools">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDialog({ kind: "create", type: "resource" })}
            >
              <FileText />
              Document
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDialog({ kind: "create", type: "project" })}
            >
              <Rocket />
              Projet
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDialog({ kind: "create", type: "resource" })}
            >
              <Link2 />
              Lien
            </Button>
          </div>
          <Button size="sm" onClick={() => setDialog({ kind: "create" })}>
            <Plus size={14} /> Publier
          </Button>
        </div>
      </div>

      <div className="feed-tabs">
        {TABS.map((tab) => (
          <Button
            key={tab.label}
            variant="ghost"
            className={type === tab.type ? "selected" : ""}
            onClick={() => setType(tab.type)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {feed.error ? (
        <ErrorState error={feed.error} onRetry={() => void feed.refetch()} />
      ) : feed.isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <>
          {visible.map((publication) => (
            <PublicationCard
              key={publication.id}
              publication={publication}
              onEdit={() => setDialog({ kind: "edit", publication })}
              onDelete={() => setDeleting(publication)}
            />
          ))}
          {visible.length === 0 && <div className="empty">Aucune publication pour le moment.</div>}
          {!compact && feed.hasNextPage && (
            <Button
              variant="outline"
              className="mx-auto mt-3"
              disabled={feed.isFetchingNextPage}
              onClick={() => void feed.fetchNextPage()}
            >
              {feed.isFetchingNextPage ? "Chargement…" : "Voir plus"}
            </Button>
          )}
        </>
      )}

      <PublicationDialogs
        dialog={dialog}
        onDialog={setDialog}
        deleting={deleting}
        onDeleting={setDeleting}
        classes={classes}
        subjects={subjects}
      />
    </>
  );
}
