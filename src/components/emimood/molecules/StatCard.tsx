import { Link, type LinkProps } from "@tanstack/react-router";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type StatTone = "success" | "warning" | "muted";

const iconTone: Record<StatTone, string> = {
  success: "bg-secondary text-secondary-foreground",
  warning: "bg-primary/10 text-primary",
  muted: "bg-muted text-muted-foreground",
};

type StatCardProps = {
  label: string;
  icon: LucideIcon;
  tone?: StatTone;
  value?: number;
  /** Phrase sous le chiffre. À passer seulement si la donnée existe vraiment. */
  note?: string;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  /** Rend toute la carte cliquable. */
  to?: LinkProps["to"];
  /** Filtres transmis à la page cible (ex. { statut: "suspend" }). */
  filter?: { statut?: string; role?: string };
};

const shell =
  "group relative flex min-h-[132px] flex-col justify-between gap-4 rounded-xl border bg-card p-5 shadow-[var(--shadow)]";

export function StatCard({
  label,
  icon: Icon,
  tone = "success",
  value,
  note,
  loading,
  error,
  onRetry,
  to,
  filter,
}: StatCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] leading-snug text-muted-foreground">{label}</span>
        <span className={cn("grid size-9 shrink-0 place-items-center rounded-lg", iconTone[tone])}>
          <Icon className="size-[18px]" aria-hidden />
        </span>
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

  // En erreur, la carte n'est pas un lien : le bouton « Réessayer » ne doit pas être dans un <a>.
  if (to && !error) {
    return (
      <Link
        to={to}
        search={(prev: { u?: string | undefined }) => ({ u: prev.u, ...filter })}
        className={cn(
          shell,
          "no-underline transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        )}
      >
        {body}
        <ArrowUpRight
          aria-hidden
          className="absolute right-4 bottom-4 size-4 text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </Link>
    );
  }

  return <div className={shell}>{body}</div>;
}
