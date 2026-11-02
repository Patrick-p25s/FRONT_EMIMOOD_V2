import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useChapterDocuments, useToggleSave } from "@/features/resource/hooks/useResources";
import { ResourceDoc } from "@/features/resource/api/schemas";
import { ResourceRow } from "@/features/resource/components/ResourceRows";
import { ResourcePreviewDialog } from "@/features/resource/components/ResourcePreviewDialog";

export function ResourceList({ chapterId }: { chapterId: string }) {
  const documents = useChapterDocuments(chapterId);
  const toggleSave = useToggleSave();
  const [selected, setSelected] = useState<ResourceDoc | null>(null);

  if (documents.isLoading) return <Skeleton className="mt-4 h-16 w-full" />;
  if (documents.isError)
    return (
      <p className="small mt-4">
        Les supports de ce chapitre ne sont pas disponibles pour le moment.
      </p>
    );

  const files = documents.data ?? [];
  if (files.length === 0) return <p className="small mt-4">Aucun support pour ce chapitre.</p>;

  return (
    <div className=" mt-4">
      <h3>Supports de cours</h3>
      {files.map((doc) => (
        <ResourceRow
          key={doc.id}
          doc={doc}
          onOpen={setSelected}
          onToggleSave={(item) => toggleSave.mutate({ id: item.id, saved: item.saved })}
        />
      ))}
      <ResourcePreviewDialog doc={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
