import { useState } from "react";
import { ExternalLink, FileText, Link2, PlayCircle, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseResource } from "../api/schemas";
import { useChapterDocuments, useToggleSave } from "@/features/resource/hooks/useResources";
import { useChapterResources } from "../hooks/useStudentCourses";
import { ResourceDoc } from "@/features/resource/api/schemas";
import { ResourceRow } from "@/features/resource/components/ResourceRows";
import { toSafeLink } from "../lib/links";
import { ResourcePreviewDialog } from "@/features/resource/components/ResourcePreviewDialog";

const ICONS: Record<CourseResource["resource_type"], LucideIcon> = {
  document: FileText,
  video: PlayCircle,
  link: Link2,
  other: ExternalLink,
};

export function ResourceList({ chapterId }: { chapterId: string }) {
  const documents = useChapterDocuments(chapterId); // fichiers (et liens déposés comme documents)
  const links = useChapterResources(chapterId); // liens, vidéos (avec position)
  const toggleSave = useToggleSave();
  const [selected, setSelected] = useState<ResourceDoc | null>(null);

  if (documents.isLoading || links.isLoading) return <Skeleton className="mt-4 h-16 w-full" />;
  if (documents.error && links.error)
    return (
      <p className="small mt-4">
        Les supports de ce chapitre ne sont pas disponibles pour le moment.
      </p>
    );

  const files = documents.data ?? [];
  const extras = [...(links.data ?? [])].sort((a, b) => a.position - b.position);
  if (files.length === 0 && extras.length === 0)
    return <p className="small mt-4">Aucun support pour ce chapitre.</p>;

  return (
    <div className="document-list mt-4">
      <h3>Supports de cours</h3>

      {files.map((doc) => (
        <ResourceRow
          key={doc.id}
          doc={doc}
          onOpen={setSelected}
          onToggleSave={(item) => toggleSave.mutate({ id: item.id, saved: item.saved })}
        />
      ))}

      {extras.map((resource) => {
        const Icon = ICONS[resource.resource_type];
        const link = toSafeLink(resource.url);
        const body = (
          <>
            <Icon size={18} className="shrink-0" aria-hidden />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{resource.title}</span>
              {resource.description && (
                <span className="small block truncate">{resource.description}</span>
              )}
            </span>
            <span className="small shrink-0">{link ? link.host : "Lien invalide"}</span>
          </>
        );
        return link ? (
          <a
            key={resource.id}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
            className="document-row no-underline"
          >
            {body}
          </a>
        ) : (
          <div key={resource.id} className="document-row opacity-60" aria-disabled>
            {body}
          </div>
        );
      })}

      {(documents.isError || links.isError) && (
        <p className="small">Une partie des supports n’a pas pu être chargée.</p>
      )}
      <ResourcePreviewDialog doc={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
