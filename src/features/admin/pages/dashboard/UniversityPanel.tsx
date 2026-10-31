// Cliquer une ligne rend l'université active pour tout l'espace d'administration.
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/emimood/atoms/Logo";
import { Panel } from "@/components/emimood/molecules/Panel";
import { StatusBadge } from "@/components/emimood/molecules/StatusBadge";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useUniversities } from "../../hooks/resources";
import { useActiveUniversity } from "../../hooks/useActiveUniversity";
import { useUniversityUserCounts } from "../../hooks/useDashboard";
import { keepU } from "../../lib/search";

export function UniversitiesPanel() {
  const { data, isLoading, error, refetch } = useUniversities();
  const { universityId, setUniversity } = useActiveUniversity();

  const universities = data?.items ?? [];
  const counts = useUniversityUserCounts(universities.map((university) => university.id));
  const max = Math.max(1, ...counts.map((count) => count.data ?? 0));

  return (
    <Panel
      title="Utilisateurs par université"
      description="Cliquez sur une ligne pour la rendre active."
      action={
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin/universities" search={keepU}>
            Tout voir
          </Link>
        </Button>
      }
    >
      {error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="grid gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full" />
          ))}
        </div>
      ) : universities.length === 0 ? (
        <EmptyState
          title="Aucune université"
          description="Créez la première université pour commencer."
          action={
            <Button asChild size="sm">
              <Link to="/admin/universities" search={keepU}>
                Créer une université
              </Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-1">
          {universities.map((university, index) => {
            const count = counts[index];
            const active = university.id === universityId;
            return (
              <li key={university.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setUniversity(active ? undefined : university.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:bg-muted",
                    active && "border-primary/30 bg-primary/10",
                  )}
                >
                  <Logo url={university.logo_url} name={university.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{university.name}</span>
                      <StatusBadge statut={university.statut} />
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${((count?.data ?? 0) / max) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="w-14 shrink-0 text-right text-sm font-semibold tabular-nums">
                    {count?.isLoading
                      ? "…"
                      : count?.isError
                        ? "—"
                        : (count?.data ?? 0).toLocaleString("fr-FR")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
