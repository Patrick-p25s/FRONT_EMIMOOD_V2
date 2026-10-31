import { useEffect, useRef, useState } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/errors";

export function CopyButton({
  value,
  label = "Copier",
}: {
  value: string;
  label?: string | undefined;
}) {
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

/** Champ secret : masqué, Afficher (charge à la demande), remasquage après 30 s. */
export function SecretField({
  load,
  label = "Code d’invitation",
}: {
  load: () => Promise<string>;
  label?: string | undefined;
}) {
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
      <code
        aria-label={label}
        className="min-w-40 rounded-md border bg-muted px-3 py-1.5 font-mono text-sm text-foreground"
      >
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
