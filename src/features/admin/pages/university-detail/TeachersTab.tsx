// pages/university-detail/TeachersTab.tsx
import { useCallback, useState } from "react";
import { UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "@/components/emimood/molecules/filters";
import { StatusBadge } from "@/components/emimood/molecules/StatusBadge";
import { DataTable, type Column } from "@/components/emimood/organisms/DataTable";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api/client";
import type { Statut } from "@/lib/domain";
import { fmtDate } from "@/lib/format";
import { adminKeys } from "../../keys";
import { useAdminSearch, useDebouncedQ } from "../../hooks/useAdminSearch";
import { readItems } from "../../lib/payload";
import { InvitationDialog } from "./InvitationDialog";

type TeacherRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  statut: Statut;
  created_at: string;
};

export function TeachersTab({ universityId }: { universityId: string }) {
  const [search, setSearch] = useAdminSearch();
  const onQ = useCallback((value: string) => setSearch({ q: value }, false), [setSearch]);
  const [q, setQ] = useDebouncedQ(search.q, onQ);
  const [inviting, setInviting] = useState(false);

  const params = { university_id: universityId, role: "teacher", q: search.q ?? "" };
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: adminKeys.list("users", params),
    queryFn: async () =>
      readItems<TeacherRow>(
        await api<unknown>("/users/", {
          query: {
            university_id: universityId,
            role: "teacher",
            ...(search.q ? { q: search.q } : {}),
            skip: "0",
            limit: "200",
          },
        }),
      ),
  });

  const columns: Column<TeacherRow>[] = [
    {
      header: "Enseignant",
      cell: (teacher) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{teacher.name ?? "—"}</p>
          <p className="truncate text-xs text-muted-foreground">{teacher.email ?? ""}</p>
        </div>
      ),
    },
    { header: "Statut", cell: (teacher) => <StatusBadge statut={teacher.statut} /> },
    { header: "Inscrit le", cell: (teacher) => fmtDate(teacher.created_at) },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <SearchInput value={q} onChange={setQ} label="Rechercher un enseignant" />
        </div>
        <Button onClick={() => setInviting(true)}>
          <UserPlus className="size-4" aria-hidden /> Inviter un enseignant
        </Button>
      </div>

      <DataTable
        caption="Enseignants de l’université"
        columns={columns}
        rows={data}
        loading={isLoading}
        error={error}
        onRetry={() => void refetch()}
        empty={
          <p className="py-10 text-center text-sm text-muted-foreground">
            Aucun enseignant inscrit. Invitez-en un : il créera son compte avec le code généré.
          </p>
        }
      />

      <InvitationDialog
        universityId={universityId}
        open={inviting}
        onOpenChange={setInviting}
        role="teacher"
        title="Inviter un enseignant"
      />
    </div>
  );
}
