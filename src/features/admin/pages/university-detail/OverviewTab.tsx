// pages/university-detail/OverviewTab.tsx
import { useState } from "react";
import { Pencil } from "lucide-react";
import { Panel } from "@/components/emimood/molecules/Panel";
import { StatCard } from "@/components/emimood/molecules/StatCard";
import { StatGrid } from "@/components/emimood/molecules/StatGrid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fmtDate } from "@/lib/format";
import type { University } from "../../api/types";
import { useCounts } from "../../hooks/useDashboard";
import { UniversityForm } from "../universities/UniversityForm";
import { STATS } from "../dashboard/stats";

const KEYS = ["users", "students", "teachers", "classes"];
const SPECS = STATS.filter((stat) => KEYS.includes(stat.key));

export function OverviewTab({ university }: { university: University }) {
  const [editing, setEditing] = useState(false);
  const counts = useCounts(SPECS, university.id);

  return (
    <div className="grid gap-6">
      <StatGrid label={`Chiffres de ${university.name}`}>
        {SPECS.map((stat, index) => {
          const query = counts[index];
          if (!query) return null;
          return (
            <StatCard
              key={stat.key}
              label={stat.label}
              icon={stat.icon}
              tone={stat.tone}
              value={query.data}
              loading={query.isLoading}
              error={query.isError}
              onRetry={() => void query.refetch()}
            />
          );
        })}
      </StatGrid>

      <Panel
        title="Informations"
        action={
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="size-4" aria-hidden /> Modifier
          </Button>
        }
      >
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">Description</dt>
            <dd className="mt-1">{university.description || "—"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Créée le</dt>
            <dd className="mt-1">{fmtDate(university.created_at)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Dernière modification</dt>
            <dd className="mt-1">{fmtDate(university.updated_at)}</dd>
          </div>
        </dl>
      </Panel>

      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l’université</DialogTitle>
            <DialogDescription>Mettez à jour les informations.</DialogDescription>
          </DialogHeader>
          <UniversityForm university={university} onDone={() => setEditing(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
