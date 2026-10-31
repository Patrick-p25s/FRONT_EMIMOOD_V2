import type { ReactNode } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { IconBox } from "@/components/emimood/atoms/IconBox";
import type { Tone } from "@/components/emimood/atoms/tones";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** La carte ne connaît pas le routeur : la page lui fournit le lien. */
export type StatLink = (props: { className: string; children: ReactNode }) => ReactNode;

type StatCardProps = {
  label: string;
  icon: LucideIcon;
  tone?: Tone | undefined;
  value?: number | undefined;
  /** Phrase sous le chiffre : seulement si la donnée existe vraiment. */
  note?: string | undefined;
  loading?: boolean | undefined;
  error?: boolean | undefined;
  onRetry?: (() => void) | undefined;
  link?: StatLink | undefined;
};

const shell =
  "group relative flex min-h-[132px] flex-col justify-between gap-4 rounded-xl border bg-card p-5 shadow-(--shadow)";
const interactive =
  "no-underline transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export function StatCard({
  label,
  icon,
  tone = "success",
  value,
  note,
  loading,
  error,
  onRetry,
  link,
}: StatCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] leading-snug text-muted-foreground">{label}</span>
        <IconBox icon={icon} tone={tone} />
      </div>
      <div>
        {loading ? (
          <Skeleton className="h-8 w-20" />
        ) : error ? (
          <Button type="button" variant="link" size="sm" className="h-8 px-0" onClick={onRetry}>
            Réessayer
          </Button>
        ) : (
          <>
            <p className="text-[32px] leading-none font-extrabold tabular-nums">
              {(value ?? 0).toLocaleString("fr-FR")}
            </p>
            {note && <p className="mt-2 text-xs text-muted-foreground">{note}</p>}
          </>
        )}
      </div>
    </>
  );

  // En erreur, pas de lien : le bouton « Réessayer » ne doit pas être dans un <a>.
  if (link && !error) {
    return (
      <>
        {link({
          className: cn(shell, interactive),
          children: (
            <>
              {body}
              <ArrowUpRight
                aria-hidden
                className="absolute right-4 bottom-4 size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              />
            </>
          ),
        })}
      </>
    );
  }
  return <div className={shell}>{body}</div>;
}
