// pages/study/ResourceList.tsx
import { ExternalLink, FileText, Link2, PlayCircle, type LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/emimood/molecules/states";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseResource } from "../api/schemas";
import { useChapterResources } from "../hooks/useStudentCourses";
import { toSafeLink } from "../lib/links";

const ICONS: Record<CourseResource["resource_type"], LucideIcon> = {
  document: FileText,
  video: PlayCircle,
  link: Link2,
  other: ExternalLink,
};

export function ResourceList({ chapterId }: { chapterId: string }) {
  const query = useChapterResources(chapterId);

  if (query.isLoading) return <Skeleton className="mt-4 h-16 w-full" />;
  if (query.error)
    return (
      <p className="small mt-4">
        Les documents de ce chapitre ne sont pas disponibles pour le moment.
      </p>
    );

  const resources = [...(query.data ?? [])].sort((a, b) => a.position - b.position);
  if (resources.length === 0) return <p className="small mt-4">Aucun document pour ce chapitre.</p>;

  return (
    <div className="document-list mt-4">
      <h3>Documents</h3>
      {resources.map((resource) => {
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
        // Une adresse qui n'est pas en http(s) n'est jamais rendue cliquable.
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
    </div>
  );
}
