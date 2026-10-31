import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  File,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Link2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Heading } from "@/components/emimood/molecules/Heading";
import { ErrorState } from "@/components/emimood/molecules/states";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounced } from "@/features/messaging/hooks/useMessaging";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Media, ResourceDoc } from "./api/schemas";
import { DocumentPreview } from "./components/DocumentPreview";
import { EditResourceDialog } from "./components/EditResourceDialog";
import {
  resourceKeys,
  useResourceMutations,
  useResources,
  useToggleSave,
} from "./hooks/useResources";
import { ClassOption, SubjectOption } from "../publication/components/PublicationForm";
import {
  PublicationDialog,
  PublicationDialogs,
} from "../publication/components/PublicationDialogs";
import { formatBytes } from "@/lib/files";
import { ResourceRow } from "./components/ResourceRows";
import { ResourcePreviewDialog } from "./components/ResourcePreviewDialog";
import { AddDocumentDialog } from "./components/AddDocumentDialog";

type Filter = "Toutes" | "Officielles" | "Étudiants" | "Enregistrées";
const FILTERS: Filter[] = ["Toutes", "Officielles", "Étudiants", "Enregistrées"];

const MEDIA_OPTIONS: { value: Media | ""; label: string }[] = [
  { value: "", label: "Tous les types" },
  { value: "pdf", label: "PDF" },
  { value: "image", label: "Images" },
  { value: "video", label: "Vidéos" },
  { value: "office", label: "Documents Office" },
  { value: "text", label: "Texte" },
  { value: "link", label: "Liens" },
];

const ICONS: Record<Media, LucideIcon> = {
  pdf: FileText,
  image: ImageIcon,
  video: Video,
  office: FileSpreadsheet,
  text: FileText,
  link: Link2,
  other: File,
};

const CONTEXT: Record<string, string> = {
  chapter: "Dans un cours",
  publication: "Dans une publication",
  subject: "Dans une matière",
  university: "Partagé avec l’université",
};

const hostOf = (url: string | null) => {
  try {
    return url ? new URL(url).hostname : "";
  } catch {
    return "";
  }
};

type ResourcesPageProps = {
  classes: ClassOption[];
  subjects: SubjectOption[];
  canUpload?: boolean;
  universityId?: string | undefined;
};

export function ResourcesPage({
  classes,
  subjects,
  canUpload = false,
  universityId,
}: ResourcesPageProps) {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const client = useQueryClient();
  const toggleSave = useToggleSave();
  const { remove } = useResourceMutations();

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("Toutes");
  const [media, setMedia] = useState<Media | "">("");
  const [subjectId, setSubjectId] = useState("");
  const [selected, setSelected] = useState<ResourceDoc | null>(null);
  const [editing, setEditing] = useState<ResourceDoc | null>(null);
  const [removing, setRemoving] = useState<ResourceDoc | null>(null);
  const [dialog, setDialog] = useState<PublicationDialog>(null);

  const q = useDebounced(input.trim(), 300);
  const origin =
    filter === "Officielles" ? "official" : filter === "Étudiants" ? "community" : undefined;
  const query = useResources({
    q,
    origin,
    saved: filter === "Enregistrées" ? true : undefined,
    media: media || undefined,
    subjectId: subjectId || undefined,
  });

  // Le serveur filtre ; on refiltre localement pour une réaction immédiate pendant la frappe.
  const list = useMemo(() => {
    const needle = input.trim().toLowerCase();
    return (query.data?.pages.flatMap((page) => page.items) ?? []).filter(
      (r) =>
        (!origin || r.official === (origin === "official")) &&
        (filter !== "Enregistrées" || r.saved) &&
        (!media || r.media === media) &&
        (!subjectId || r.subject?.id === subjectId) &&
        (!needle || r.title.toLowerCase().includes(needle)),
    );
  }, [query.data, input, origin, filter, media, subjectId]);

  const total = query.data?.pages[0]?.total ?? 0;

  const changeDialog = (next: PublicationDialog) => {
    setDialog(next);
    if (next === null) void client.invalidateQueries({ queryKey: resourceKeys.all }); // une ressource a peut-être été publiée
  };

  return (
    <div className="page">
      <Heading
        title="Ressources"
        subtitle="Les connaissances de notre communauté, à portée de main."
        action={
          <div className="flex flex-wrap gap-2">
            {canUpload && (
              <Button variant="outline" onClick={() => setUploading(true)}>
                <Plus /> Déposer un document
              </Button>
            )}
            <Button onClick={() => changeDialog({ kind: "create", type: "resource" })}>
              <Plus /> Publier une ressource
            </Button>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap gap-3">
        <Input
          placeholder="Rechercher un document…"
          value={input}
          maxLength={100}
          onChange={(event) => setInput(event.target.value)}
          aria-label="Rechercher un document"
          className="max-w-md"
        />
        <select
          aria-label="Type de document"
          className="rounded-md border bg-card p-2 text-sm"
          value={media}
          onChange={(event) => setMedia(event.target.value as Media | "")}
        >
          {MEDIA_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {subjects.length > 0 && (
          <select
            aria-label="Matière"
            className="rounded-md border bg-card p-2 text-sm"
            value={subjectId}
            onChange={(event) => setSubjectId(event.target.value)}
          >
            <option value="">Toutes les matières</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <Button
            key={f}
            variant={filter === f ? "secondary" : "outline"}
            size="sm"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {query.error ? (
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : query.isLoading ? (
        <div className="grid gap-2">
          {[0, 1, 2, 3].map((key) => (
            <Skeleton key={key} className="h-16 w-full" />
          ))}
        </div>
      ) : (
        <div className="document-list">
          {list.map((r) => {
            const isOwner = Boolean(user && r.owner?.id === user.id);
            const deletable = isOwner && (r.source === "other" || r.source === "subject");
            return (
              <ResourceRow
                key={r.id}
                doc={r}
                onOpen={setSelected}
                onToggleSave={(doc) => toggleSave.mutate({ id: doc.id, saved: doc.saved })}
                menu={
                  isOwner ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" aria-label={`Options pour ${r.title}`}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setEditing(r)}>
                          <Pencil /> Modifier
                        </DropdownMenuItem>
                        {deletable && (
                          <DropdownMenuItem onSelect={() => setRemoving(r)}>
                            <Trash2 /> Supprimer
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : undefined
                }
              />
            );
          })}
          <ResourcePreviewDialog doc={selected} onClose={() => setSelected(null)} />
          {list.length === 0 && (
            <p className="empty">
              {filter === "Enregistrées"
                ? "Vous n’avez rien enregistré pour le moment."
                : "Aucune ressource ne correspond à votre recherche."}
            </p>
          )}
          {query.hasNextPage && (
            <Button
              variant="ghost"
              className="mx-auto"
              disabled={query.isFetchingNextPage}
              onClick={() => void query.fetchNextPage()}
            >
              {query.isFetchingNextPage ? "Chargement…" : `Voir plus (${list.length} sur ${total})`}
            </Button>
          )}
        </div>
      )}

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="truncate">{selected?.title}</DialogTitle>
            <DialogDescription>
              {[
                selected?.subject?.name,
                selected?.owner?.name,
                selected &&
                  (CONTEXT[selected.contextType] ?? "") +
                    (selected.contextLabel ? ` · ${selected.contextLabel}` : ""),
              ]
                .filter(Boolean)
                .join(" · ")}
            </DialogDescription>
          </DialogHeader>
          {selected?.description && (
            <p className="whitespace-pre-line text-sm">{selected.description}</p>
          )}
          {selected && <DocumentPreview key={selected.id} doc={selected} />}
        </DialogContent>
      </Dialog>

      <EditResourceDialog doc={editing} onClose={() => setEditing(null)} />
      <AddDocumentDialog
        open={uploading}
        onOpenChange={setUploading}
        target={{ kind: "library", subjects, universityId }}
      />

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title={`Supprimer « ${removing?.title ?? ""} » ?`}
        description="Le document sera supprimé définitivement pour tout le monde."
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

      <PublicationDialogs
        dialog={dialog}
        onDialog={changeDialog}
        deleting={null}
        onDeleting={() => undefined}
        classes={classes}
        subjects={subjects}
      />
    </div>
  );
}
