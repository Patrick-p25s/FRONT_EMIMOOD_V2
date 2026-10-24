// features/publications/components/PublicationDialogs.tsx
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Publication, PublicationType } from "../api/types";
import { usePublicationMutations } from "../hooks/usePublicationMutations";
import { PublicationForm, type ClassOption, type SubjectOption } from "./PublicationForm";

export type PublicationDialog =
  | { kind: "create"; type?: PublicationType | undefined }
  | { kind: "edit"; publication: Publication }
  | null;

type PublicationDialogsProps = {
  dialog: PublicationDialog;
  onDialog: (dialog: PublicationDialog) => void;
  deleting: Publication | null;
  onDeleting: (publication: Publication | null) => void;
  classes: ClassOption[];
  subjects: SubjectOption[];
};

export function PublicationDialogs({
  dialog,
  onDialog,
  deleting,
  onDeleting,
  classes,
  subjects,
}: PublicationDialogsProps) {
  const { remove } = usePublicationMutations();
  return (
    <>
      <Dialog open={dialog !== null} onOpenChange={(open) => !open && onDialog(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {dialog?.kind === "edit" ? "Modifier la publication" : "Créer une publication"}
            </DialogTitle>
          </DialogHeader>
          {dialog && (
            <PublicationForm
              key={dialog.kind === "edit" ? dialog.publication.id : `new-${dialog.type ?? "any"}`}
              classes={classes}
              subjects={subjects}
              publication={dialog.kind === "edit" ? dialog.publication : undefined}
              initialType={dialog.kind === "create" ? dialog.type : undefined}
              onDone={() => onDialog(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && onDeleting(null)}
        title="Supprimer cette publication ?"
        description="Elle disparaît pour tout le monde, avec ses commentaires."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await remove.mutateAsync(deleting.id);
            onDeleting(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </>
  );
}
