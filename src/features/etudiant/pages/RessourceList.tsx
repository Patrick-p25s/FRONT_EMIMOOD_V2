import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useChapterDocuments, useToggleSave } from "@/features/resource/hooks/useResources";
import { ResourceDoc } from "@/features/resource/api/schemas";
import { ResourceRow } from "@/features/resource/components/ResourceRows";
import { ResourcePreviewDialog } from "@/features/resource/components/ResourcePreviewDialog";
import { useChapterResources } from "@/features/course-ressources/hooks/useCourseRessources";
import { CourseResourceRow } from "@/features/course-ressources/components/CourseRessourceRow";

export function ResourceList({ chapterId }: { chapterId: string }) {
  const documents = useChapterDocuments(chapterId); // fichiers (et liens déposés comme documents)
  const links = useChapterResources(chapterId);
  const toggleSave = useToggleSave();
  const [selected, setSelected] = useState<ResourceDoc | null>(null);
  const extras = links.data ?? [];
  if (documents.isLoading || links.isLoading) return <Skeleton className="mt-4 h-16 w-full" />;
  if (documents.error && links.error)
    return (
      <p className="small mt-4">
        Les supports de ce chapitre ne sont pas disponibles pour le moment.
      </p>
    );

  const files = documents.data ?? [];
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

      {extras.map((resource) => (
        <CourseResourceRow key={resource.id} resource={resource} />
      ))}

      {(documents.isError || links.isError) && (
        <p className="small">Une partie des supports n’a pas pu être chargée.</p>
      )}
      <ResourcePreviewDialog doc={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
