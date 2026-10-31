import { useState } from "react";
import { FileText, Link2, Plus, Rocket } from "lucide-react";
import { ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useInfiniteSentinel } from "../hooks/useInfiniteSentinel";
import { usePublicationFeed } from "../hooks/usePublications";
import { PublicationDialogs, type PublicationDialog } from "./PublicationDialogs";
import type { ClassOption, SubjectOption } from "./PublicationForm";
import type { Publication, PublicationType } from "@/features/enseignant/api/types";
import { useMyProfile } from "@/features/profile/hoooks/useProfile";
import { UserAvatar } from "@/features/profile/components/UserAvatar";
import { Post } from "./Post";

type Tab = { key: string; label: string; type?: PublicationType | undefined; mine?: boolean };

const BASIC_TABS: Tab[] = [
  { key: "all", label: "Pour vous" },
  { key: "announcement", label: "Annonces", type: "announcement" },
  { key: "project", label: "Projets", type: "project" },
];
const FULL_TABS: Tab[] = [
  ...BASIC_TABS,
  { key: "event", label: "Événements", type: "event" },
  { key: "resource", label: "Ressources", type: "resource" },
  { key: "experience", label: "Expériences", type: "experience" },
  { key: "mine", label: "Mes publications", mine: true },
];

type CampusFeedProps = { classes: ClassOption[]; subjects: SubjectOption[]; compact?: boolean };

export function CampusFeed({ classes, subjects, compact = false }: CampusFeedProps) {
  const { user } = useAuth();
  const avatarUrl = useMyProfile().data?.avatar_url ?? null;
  const firstName = user?.name.split(" ")[0] ?? "";
  const tabs = compact ? BASIC_TABS : FULL_TABS;

  const [tabKey, setTabKey] = useState("all");
  const tab = tabs.find((item) => item.key === tabKey) ?? tabs[0]!;
  const [dialog, setDialog] = useState<PublicationDialog>(null);
  const [deleting, setDeleting] = useState<Publication | null>(null);

  const feed = usePublicationFeed({
    type: tab.type,
    authorId: tab.mine && user ? user.id : undefined,
  });
  const items = feed.data?.pages.flatMap((page) => page.items) ?? [];
  const visible = compact ? items.slice(0, 2) : items;

  const sentinel = useInfiniteSentinel(
    !compact && Boolean(feed.hasNextPage) && !feed.isFetchingNextPage,
    () => void feed.fetchNextPage(),
  );

  return (
    <>
      <div className="composer">
        <div className="composer-top">
          <UserAvatar name={user?.name ?? "?"} url={avatarUrl} />
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

      <div
        className="feed-tabs overflow-x-auto whitespace-nowrap"
        role="tablist"
        aria-label="Filtrer les publications"
      >
        {tabs.map((item) => (
          <Button
            key={item.key}
            variant="ghost"
            role="tab"
            aria-selected={tab.key === item.key}
            className={tab.key === item.key ? "selected" : ""}
            onClick={() => setTabKey(item.key)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {feed.error ? (
        <ErrorState error={feed.error} onRetry={() => void feed.refetch()} />
      ) : feed.isLoading ? (
        <div className="grid gap-4">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <>
          {visible.map((publication) => (
            <Post
              key={publication.id}
              post={publication}
              onEdit={() => setDialog({ kind: "edit", publication })}
              onDelete={() => setDeleting(publication)}
            />
          ))}

          {visible.length === 0 && (
            <div className="empty">
              <p>
                {tab.mine
                  ? "Vous n’avez encore rien publié."
                  : tab.type
                    ? "Aucune publication de ce type pour le moment."
                    : "Aucune publication pour le moment. Lancez la conversation !"}
              </p>
              {(tab.mine || !tab.type) && (
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() =>
                    setDialog({ kind: "create", ...(tab.type ? { type: tab.type } : {}) })
                  }
                >
                  <Plus size={14} /> Publier
                </Button>
              )}
            </div>
          )}

          {!compact && feed.hasNextPage && (
            <div ref={sentinel} className="py-4 text-center">
              <Button
                variant="outline"
                disabled={feed.isFetchingNextPage}
                onClick={() => void feed.fetchNextPage()}
              >
                {feed.isFetchingNextPage ? "Chargement…" : "Voir plus"}
              </Button>
            </div>
          )}
          {!compact && !feed.hasNextPage && visible.length > 8 && (
            <p className="small py-4 text-center">Vous êtes à jour.</p>
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
