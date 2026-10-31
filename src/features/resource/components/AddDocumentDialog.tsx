// features/resources/components/AddDocumentDialog.tsx
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
import { uploadSchema } from "../api/schemas";
import { useResourceMutations } from "../hooks/useResources";
import { formatBytes } from "@/lib/files";

type SubjectOption = { id: string; name: string };
export type UploadTarget =
  | { kind: "chapter"; chapterId: string }
  | { kind: "library"; subjects: SubjectOption[]; universityId?: string | undefined };

function UploadForm({ target, onDone }: { target: UploadTarget; onDone: () => void }) {
  const { upload } = useResourceMutations();
  const [mode, setMode] = useState<"file" | "link">("file");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    if (mode === "file" && !file) return setError("Choisissez un fichier.");
    if (mode === "link" && !url.trim()) return setError("Collez l’adresse du lien.");

    const where =
      target.kind === "chapter"
        ? { source: "chapter" as const, chapterId: target.chapterId }
        : subjectId
          ? { source: "subject" as const, subjectId }
          : {
              source: "other" as const,
              ...(target.universityId ? { universityId: target.universityId } : {}),
            };

    const candidate = {
      ...where,
      title: title.trim() || undefined,
      description: description.trim() || undefined,
      ...(mode === "file" ? { file: file ?? undefined } : { url: url.trim() }),
    };
    const parsed = uploadSchema.safeParse(candidate);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Valeurs invalides.");
    setError("");
    try {
      await upload.mutateAsync(candidate);
      onDone();
    } catch {
      // message déjà affiché par la mutation
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex gap-2" role="group" aria-label="Type de support">
        <Button
          type="button"
          size="sm"
          variant={mode === "file" ? "secondary" : "outline"}
          aria-pressed={mode === "file"}
          onClick={() => setMode("file")}
        >
          Fichier
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "link" ? "secondary" : "outline"}
          aria-pressed={mode === "link"}
          onClick={() => setMode("link")}
        >
          Lien
        </Button>
      </div>

      {mode === "file" ? (
        <div className="grid gap-1.5">
          <label htmlFor="doc-file" className="text-sm font-medium">
            Fichier
          </label>
          <Input
            id="doc-file"
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          {file && (
            <p className="small">
              {file.name} · {formatBytes(file.size)}
            </p>
          )}
        </div>
      ) : (
        <div className="grid gap-1.5">
          <label htmlFor="doc-url" className="text-sm font-medium">
            Adresse du lien
          </label>
          <Input
            id="doc-url"
            type="url"
            inputMode="url"
            maxLength={2083}
            placeholder="https://…"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
      )}

      <div className="grid gap-1.5">
        <label htmlFor="doc-title" className="text-sm font-medium">
          Titre <span className="font-normal text-muted-foreground">(facultatif)</span>
        </label>
        <Input
          id="doc-title"
          maxLength={200}
          placeholder={
            mode === "file" ? "Par défaut : le nom du fichier" : "Par défaut : l’adresse"
          }
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="doc-desc" className="text-sm font-medium">
          Description <span className="font-normal text-muted-foreground">(facultatif)</span>
        </label>
        <Textarea
          id="doc-desc"
          rows={3}
          maxLength={5000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>

      {target.kind === "library" && target.subjects.length > 0 && (
        <div className="grid gap-1.5">
          <label htmlFor="doc-subject" className="text-sm font-medium">
            Rattacher à une matière
          </label>
          <select
            id="doc-subject"
            className="rounded-md border bg-card p-2 text-sm"
            value={subjectId}
            onChange={(event) => setSubjectId(event.target.value)}
          >
            <option value="">Aucune : visible dans la bibliothèque</option>
            {target.subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button disabled={upload.isPending} onClick={() => void submit()}>
          {upload.isPending ? "Envoi…" : "Ajouter"}
        </Button>
      </div>
    </div>
  );
}

type AddDocumentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: UploadTarget;
};

export function AddDocumentDialog({ open, onOpenChange, target }: AddDocumentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {target.kind === "chapter" ? "Ajouter un support de cours" : "Déposer un document"}
          </DialogTitle>
          <DialogDescription>Un fichier ou un lien, pas les deux.</DialogDescription>
        </DialogHeader>
        {open && <UploadForm target={target} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}
