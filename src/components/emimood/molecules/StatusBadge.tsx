import { cn } from "@/lib/utils";
import { statutLabel, type Statut } from "@/lib/domain";

const tones = {
  success: "border-success/40 bg-success/10 text-success",
  warning: "border-primary/40 bg-primary/10 text-primary",
  muted: "border-border bg-muted text-muted-foreground",
} as const;
type Tone = keyof typeof tones;

const statutTone: Record<Statut, Tone> = {
  active: "success",
  suspend: "warning",
  inactive: "muted",
};

type StatusBadgeProps = {
  statut?: Statut | undefined;
  label?: string | undefined;
  tone?: Tone | undefined;
};

export function StatusBadge({ statut, label, tone }: StatusBadgeProps) {
  const resolved = statut
    ? { label: statutLabel[statut], tone: statutTone[statut] }
    : { label: label ?? "", tone: tone ?? "muted" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
        tones[resolved.tone],
      )}
    >
      {resolved.label}
    </span>
  );
}
