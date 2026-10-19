// src/components/emimood/organisms/dialogs.tsx
import { useEffect, useState, type ReactNode } from "react";
import { CopyButton } from "@/components/emimood/molecules/secrets";
import { Field } from "@/components/emimood/molecules/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string | undefined;
  destructive?: boolean | undefined;
  /** Texte à retaper pour autoriser l'action (suppressions, désactivations). */
  requireText?: string | undefined;
  onConfirm: () => Promise<unknown>;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  destructive,
  requireText,
  onConfirm,
}: ConfirmDialogProps) {
  const [busy, setBusy] = useState(false);
  const [typed, setTyped] = useState("");
  useEffect(() => {
    if (!open) setTyped("");
  }, [open]);
  const blocked = !!requireText && typed !== requireText;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-sm text-muted-foreground">{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {requireText && (
          <Field id="confirm-text" label={`Retapez « ${requireText} » pour confirmer`}>
            <Input
              id="confirm-text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              autoComplete="off"
            />
          </Field>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy || blocked}
            className={
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : undefined
            }
            onClick={async (e) => {
              e.preventDefault();
              setBusy(true);
              try {
                await onConfirm();
                onOpenChange(false);
              } catch {
                /* toast déjà affiché */
              } finally {
                setBusy(false);
              }
            }}
          >
            {busy ? "Patientez…" : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Secret affiché une seule fois (création de classe ou de code). */
export function OnceSecretDialog({
  secret,
  title,
  onClose,
}: {
  secret: string | null;
  title: string;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!secret} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Copiez ce code maintenant : il ne sera plus affiché dans les listes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted px-4 py-3">
          <code className="font-mono text-lg font-bold break-all text-foreground">{secret}</code>
          {secret && <CopyButton value={secret} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
