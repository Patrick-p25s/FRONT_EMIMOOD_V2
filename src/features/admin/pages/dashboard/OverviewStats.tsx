// Synthèse des indicateurs de la plateforme.
import { Link } from "@tanstack/react-router";
import { StatCard } from "@/components/emimood/molecules/StatCard";
import { StatGrid } from "@/components/emimood/molecules/StatGrid";
import { useActiveUniversity } from "../../hooks/useActiveUniversity";
import { useCounts } from "../../hooks/useDashboard";
import { STATS } from "./stats";

export function OverviewStats() {
  const { universityId } = useActiveUniversity();
  const counts = useCounts(STATS, universityId);

  // Les notes viennent de vrais totaux : rien n'est inventé.
  const byKey: Record<string, number | undefined> = Object.fromEntries(
    STATS.map((stat, index) => [stat.key, counts[index]?.data]),
  );
  const shareOfUsers = (key: string) => {
    const total = byKey["users"];
    const part = byKey[key];
    return total && part !== undefined
      ? `${Math.round((part / total) * 100)} % des utilisateurs`
      : undefined;
  };
  const notes: Record<string, string | undefined> = {
    students: shareOfUsers("students"),
    teachers: shareOfUsers("teachers"),
    suspended: shareOfUsers("suspended"),
  };

  return (
    <StatGrid label="Chiffres clés">
      {STATS.map((stat, index) => {
        const query = counts[index];
        if (!query) return null;
        return (
          <StatCard
            key={stat.key}
            label={stat.label}
            icon={stat.icon}
            tone={stat.tone}
            value={query.data}
            note={notes[stat.key]}
            loading={query.isLoading}
            error={query.isError}
            onRetry={() => void query.refetch()}
            link={({ className, children }) => (
              <Link
                to={stat.to}
                search={(prev: { u?: string | undefined }) => ({ u: prev.u, ...stat.filter })}
                className={className}
              >
                {children}
              </Link>
            )}
          />
        );
      })}
    </StatGrid>
  );
}
