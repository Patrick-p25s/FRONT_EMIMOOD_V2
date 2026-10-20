// AdminPage.tsx : assemble seulement, sans style ni logique
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";
import { Button } from "@/components/ui/button";
import { useActiveUniversity } from "../../hooks/useActiveUniversity";
import { useCurrentYear } from "../../hooks/useDashboard";
import { keepU } from "../../lib/search";
import { OverviewStats } from "./overviewstats";
import { QuickActions } from "./QuickActions";
import { UniversitiesPanel } from "./UniversityPanel";

export function AdminPage() {
  const { university } = useActiveUniversity();
  const { data: year } = useCurrentYear();

  return (
    <>
      <PageHeader
        title="Vue globale"
        description={
          university
            ? `Chiffres de ${university.name}.`
            : "Ce qui se passe sur toute la plateforme, toutes universités confondues."
        }
        actions={
          <>
            {year && <StatusPill tone="success">Année {year.name}</StatusPill>}
            <Button asChild>
              <Link to="/admin/universities" search={keepU}>
                <Plus className="size-4" aria-hidden /> Nouvelle université
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-6">
        <OverviewStats />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <UniversitiesPanel />
          <QuickActions />
        </div>
      </div>
    </>
  );
}
