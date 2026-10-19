import { useEffect, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, Check, ChevronLeft, ChevronRight, Copy, Eye, EyeOff, Inbox, RefreshCw } from "lucide-react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Statut } from "@/features/admin/api/types";

// ---------- Formats ----------
const dtf = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });
const dtfTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });
export const fmtDate = (s: string | null | undefined) => (s ? dtf.format(new Date(s)) : "—");
export const fmtDateTime = (s: string | null | undefined) => (s ? dtfTime.format(new Date(s)) : "—");
export const initials = (s: string) =>
  s
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .slice(0, 2)
    .join("")
    .toUpperCase();

export function errorMessage(e: unknown) {
  return e instanceof ApiError ? e.detail : "Une erreur est survenue, réessayez";
}
/** Mappe les erreurs 422/409 de FastAPI vers les champs du formulaire. */
export function applyServerErrors<T extends FieldValues>(e: unknown, setError: UseFormSetError<T>, fields: string[]) {
  if (!(e instanceof ApiError)) return;
  let mapped = false;
  Object.entries(e.fieldErrors ?? {}).forEach(([k, msg]) => {
    if (fields.includes(k)) {
      setError(k as Path<T>, { message: msg });
      mapped = true;
    }
  });
  if (!mapped) setError("root" as Path<T>, { message: e.detail });
}

// ---------- Mise en page ----------
export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  );
}

const statutTone: Record<string, string> = {
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-primary/40 bg-primary/10 text-primary",
  muted: "border-border bg-muted text-muted-foreground",
};
const statutMap: Record<Statut, { label: string; tone: keyof typeof statutTone }> = {
  active: { label: "Actif", tone: "success" },
  suspend: { label: "Suspendu", tone: "warning" },
  inactive: { label: "Désactivé", tone: "muted" },
};
export function StatusBadge({ statut, label, tone }: { statut?: Statut; label?: string; tone?: keyof typeof statutTone }) {
  const s = statut ? statutMap[statut] : { label: label ?? "", tone: tone ?? "muted" };
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold", statutTone[s.tone])}>{s.label}</span>
  );
}

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-card px-6 py-12 text-center">
      <Inbox className="size-8 text-muted-foreground" aria-hidden />
      <p className="font-semibold text-foreground">{title}</p>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/5 px-6 py-10 text-center">
      <AlertTriangle className="size-7 text-destructive" aria-hidden />
      <p className="text-sm text-foreground">{errorMessage(error)}</p>
      <Button variant="outline" size="sm" onClick={onRetry}>
        <RefreshCw className="size-4" /> Réessayer
      </Button>
    </div>
  );
}

// ---------- Tableau ----------
export type Column<T> = { header: string; cell: (row: T) => ReactNode; className?: string };
export function DataTable<T extends { id: string }>({
  columns,
  rows,
  loading,
  error,
  onRetry,
  empty,
  onRowClick,
  pagination,
  caption,
}: {
  columns: Column<T>[];
  rows: T[] | undefined;
  loading: boolean;
  error: unknown;
  onRetry: () => void;
  empty: ReactNode;
  onRowClick?: (row: T) => void;
  caption: string;
  pagination?: { page: number; pages: number; total: number; pageSize: number; onPage: (p: number) => void; onPageSize: (s: number) => void };
}) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (!loading && rows && rows.length === 0) return <>{empty}</>;
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <caption className="sr-only">{caption}</caption>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.header} scope="col" className={c.className}>
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !rows
              ? Array.from({ length: 5 }, (_, i) => (
                  <TableRow key={i}>
                    {columns.map((c) => (
                      <TableCell key={c.header}>
                        <Skeleton className="h-4 w-full max-w-40" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows?.map((r) => (
                  <TableRow
                    key={r.id}
                    className={onRowClick ? "cursor-pointer" : undefined}
                    onClick={onRowClick ? () => onRowClick(r) : undefined}
                    onKeyDown={onRowClick ? (e) => e.key === "Enter" && onRowClick(r) : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                  >
                    {columns.map((c) => (
                      <TableCell key={c.header} className={c.className}>
                        {c.cell(r)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      {pagination && pagination.total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            {pagination.total} élément{pagination.total > 1 ? "s" : ""} · page {pagination.page} / {Math.max(pagination.pages, 1)}
          </span>
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="page-size">
              Taille de page
            </label>
            <select
              id="page-size"
              className="h-8 rounded-md border bg-background px-2 text-foreground"
              value={pagination.pageSize}
              onChange={(e) => pagination.onPageSize(Number(e.target.value))}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
            <Button variant="outline" size="icon" className="size-8" aria-label="Page précédente" disabled={pagination.page <= 1} onClick={() => pagination.onPage(pagination.page - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              aria-label="Page suivante"
              disabled={pagination.page >= pagination.pages}
              onClick={() => pagination.onPage(pagination.page + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Dialogues ----------
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmer",
  destructive,
  requireText,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  destructive?: boolean;
  requireText?: string;
  onConfirm: () => Promise<unknown>;
}) {
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
            <Input id="confirm-text" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" />
          </Field>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy || blocked}
            className={destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined}
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

export function CopyButton({ value, label = "Copier" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setDone(true);
          toast.success("Copié dans le presse-papiers");
          setTimeout(() => setDone(false), 1500);
        } catch {
          toast.error("Copie impossible");
        }
      }}
    >
      {done ? <Check className="size-4" /> : <Copy className="size-4" />} {label}
    </Button>
  );
}

/** Secret affiché une seule fois (création de classe ou de code). */
export function OnceSecretDialog({ secret, title, onClose }: { secret: string | null; title: string; onClose: () => void }) {
  return (
    <Dialog open={!!secret} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Copiez ce code maintenant : il ne sera plus affiché dans les listes.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted px-4 py-3">
          <code className="break-all font-mono text-lg font-bold text-foreground">{secret}</code>
          {secret && <CopyButton value={secret} />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Champ secret : masqué, Afficher (charge à la demande), remasquage après 30 s. */
export function SecretField({ load, label = "Code d’invitation" }: { load: () => Promise<string>; label?: string }) {
  const [value, setValue] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const show = async () => {
    setBusy(true);
    try {
      setValue(await load());
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setValue(null), 30000);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <code aria-label={label} className="min-w-40 rounded-md border bg-muted px-3 py-1.5 font-mono text-sm text-foreground">
        {value ?? "••••••••••"}
      </code>
      {value ? (
        <>
          <Button type="button" variant="outline" size="sm" onClick={() => setValue(null)}>
            <EyeOff className="size-4" /> Masquer
          </Button>
          <CopyButton value={value} />
        </>
      ) : (
        <Button type="button" variant="outline" size="sm" onClick={show} disabled={busy}>
          <Eye className="size-4" /> {busy ? "Chargement…" : "Afficher"}
        </Button>
      )}
    </div>
  );
}

// ---------- Sélecteurs ----------
export const ALL = "__all__";
export function SimpleSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  allLabel,
  disabled,
  className,
}: {
  id: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  allLabel?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Select value={value ?? (allLabel ? ALL : "")} onValueChange={(v) => onChange(v === ALL ? undefined : v)} disabled={disabled ?? false}>
      <SelectTrigger id={id} className={cn("w-full sm:w-52", className)} aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function SearchInput({ value, onChange, label = "Rechercher" }: { value: string; onChange: (v: string) => void; label?: string }) {
  return <Input type="search" aria-label={label} placeholder={`${label}…`} value={value} onChange={(e) => onChange(e.target.value)} className="w-full sm:w-64" />;
}

export function Logo({ url, name }: { url: string | null; name: string }) {
  const [failed, setFailed] = useState(false);
  if (url && url.startsWith("https://") && !failed) {
    return <img src={url} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="size-9 rounded-lg border object-cover" />;
  }
  return (
    <span aria-hidden className="grid size-9 place-items-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground">
      {initials(name)}
    </span>
  );
}

export function NeedUniversity() {
  return <EmptyState title="Choisissez une université" description="Cet écran porte sur une seule université. Sélectionnez-la dans la barre du haut." />;
}
