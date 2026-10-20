// pages/university-detail/CodesTab.tsx
import { useState } from "react";
import { Plus } from "lucide-react";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { DataTable, type Column } from "@/components/emimood/organisms/DataTable";
import { Button } from "@/components/ui/button";
import { fmtDate } from "@/lib/format";
import type { InvitationCode } from "../../api/types";
import { useInvitationCodes, useInvitationMutations } from "../../hooks/useInvitationCodes";
import { InvitationDialog, ROLE_LABEL } from "./InvitationDialog";

export function CodesTab({ universityId }: { universityId: string }) {
  const [activeOnly, setActiveOnly] = useState(true);
  const [creating, setCreating] = useState(false);
  const [toDeactivate, setToDeactivate] = useState<InvitationCode | null>(null);
  const { data, isLoading, error, refetch } = useInvitationCodes(universityId, activeOnly);
  const { deactivate } = useInvitationMutations();

  const columns: Column<InvitationCode>[] = [
    { header: "Rôle", cell: (code) => ROLE_LABEL[code.role] },
    { header: "Utilisations", cell: (code) => `${code.used_count} / ${code.max_uses ?? "∞"}` },
    {
      header: "Expire le",
      cell: (code) => (code.expires_at ? fmtDate(code.expires_at) : "Jamais"),
    },
    {
      header: "Statut",
      cell: (code) => (
        <StatusPill tone={code.is_active ? "success" : "muted"}>
          {code.is_active ? "Actif" : "Inactif"}
        </StatusPill>
      ),
    },
    { header: "Créé le", cell: (code) => fmtDate(code.created_at) },
    {
      header: "Actions",
      className: "text-right",
      cell: (code) =>
        code.is_active ? (
          <Button variant="ghost" size="sm" onClick={() => setToDeactivate(code)}>
            Désactiver
          </Button>
        ) : null,
    },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!activeOnly}
            onChange={(event) => setActiveOnly(!event.target.checked)}
          />
          Afficher aussi les codes inactifs
        </label>
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden /> Nouveau code
        </Button>
      </div>

      <DataTable
        caption="Codes d’invitation de l’université"
        columns={columns}
        rows={data}
        loading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        empty={
          <p className="py-10 text-center text-sm text-muted-foreground">
            Aucun code pour le moment.
          </p>
        }
      />

      <InvitationDialog
        universityId={universityId}
        open={creating}
        onOpenChange={setCreating}
        title="Nouveau code d’invitation"
      />

      <ConfirmDialog
        open={toDeactivate !== null}
        onOpenChange={(open) => !open && setToDeactivate(null)}
        title="Désactiver ce code ?"
        description="Plus personne ne pourra l’utiliser pour s’inscrire. Les comptes déjà créés ne changent pas."
        confirmLabel="Désactiver"
        destructive
        onConfirm={async () => {
          if (!toDeactivate) return;
          try {
            await deactivate.mutateAsync(toDeactivate.id);
            setToDeactivate(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </div>
  );
}
