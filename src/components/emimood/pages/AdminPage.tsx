// AdminPage.tsx : compose, ne contient ni style ni logique

import { useActiveUniversity } from "@/features/admin/hooks/useActiveUniversity";

import { PageHeader } from "../molecules/PageHeader";
import { StatusBadge } from "../molecules/StatusBadge";
import { QuickActions } from "../molecules/QuickActions";

export function AdminPage() {
  const { university } = useActiveUniversity();

  return (
    <>
      <PageHeader
        title="Vue globale"
        description={
          university
            ? `Chiffres de ${university.name}.`
            : "Ce qui se passe sur toute la plateforme, toutes universités confondues."
        }
        actions={<StatusBadge label={`Année `} tone="success" />}
      />

      <div className="grid gap-6">
        {/*  */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <QuickActions />
        </div>
      </div>
    </>
  );
}
