// features/resources/components/EditResourceDialog.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateSchema, type ResourceDoc } from "../api/schemas";
import { useResourceMutations } from "../hooks/useResources";

function EditForm({ doc, onDone }: { doc: ResourceDoc; onDone: () => void }) {
  const { update } = useResourceMutations();
  const [title, setTitle] = useState(doc.title);
  const [description, setDescription] = useState(doc.description);
  const [error, setError] = useState("");

  const submit = async () => {
    const parsed = updateSchema.safeParse({ title, description });
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Valeurs invalides.");
    setError("");
    try {
      await update.mutateAsync({ id: doc.id, ...parsed.data });
      onDone();
    } catch {
      // message déjà affiché par la mutation
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="res-title" className="text-sm font-medium">
          Titre
        </label>
        <Input
          id="res-title"
          maxLength={200}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>
      <div className="grid gap-1.5">
        <label htmlFor="res-desc" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="res-desc"
          rows={4}
          maxLength={5000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button disabled={update.isPending} onClick={() => void submit()}>
          {update.isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}

export function EditResourceDialog({
  doc,
  onClose,
}: {
  doc: ResourceDoc | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={doc !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la ressource</DialogTitle>
          <DialogDescription>
            Le titre et la description sont visibles par tous ceux qui peuvent la consulter.
          </DialogDescription>
        </DialogHeader>
        {doc && <EditForm key={doc.id} doc={doc} onDone={onClose} />}
      </DialogContent>
    </Dialog>
  );
}
