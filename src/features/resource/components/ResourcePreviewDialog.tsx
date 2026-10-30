// features/resources/components/ResourcePreviewDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { ResourceDoc } from "../api/schemas";
import { DocumentPreview } from "./DocumentPreview";

const CONTEXT: Record<string, string> = {
  chapter: "Dans un cours",
  publication: "Dans une publication",
  subject: "Dans une matière",
  university: "Partagé avec l’université",
};

export function ResourcePreviewDialog({
  doc,
  onClose,
}: {
  doc: ResourceDoc | null;
  onClose: () => void;
}) {
  const where = doc
    ? `${CONTEXT[doc.contextType] ?? ""}${doc.contextLabel ? ` · ${doc.contextLabel}` : ""}`
    : "";
  return (
    <Dialog open={doc !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="truncate">{doc?.title}</DialogTitle>
          <DialogDescription>
            {[doc?.subject?.name, doc?.owner?.name, where].filter(Boolean).join(" · ")}
          </DialogDescription>
        </DialogHeader>
        {doc?.description && <p className="whitespace-pre-line text-sm">{doc.description}</p>}
        {doc && <DocumentPreview key={doc.id} doc={doc} />}
      </DialogContent>
    </Dialog>
  );
}
