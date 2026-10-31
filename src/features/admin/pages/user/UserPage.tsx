// features/admin/pages/users/UsersPage.tsx
import { useCallback } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MoreHorizontal, UserRound } from "lucide-react";
import { SearchInput, SimpleSelect } from "@/components/emimood/molecules/filters";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";
import { StatusBadge } from "@/components/emimood/molecules/StatusBadge";
import { DataTable, type Column } from "@/components/emimood/organisms/DataTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { roleLabel } from "@/features/profile/lib/labels";
import { fmtDate } from "@/lib/format";
import type { AdminUser } from "../../api/types";
import { useAdminList } from "../../hooks/useAdminList";
import { useAdminSearch, useDebouncedQ } from "../../hooks/useAdminSearch";
import { STATUT_OPTIONS } from "../../lib/statut";
import { UserAvatar } from "@/features/profile/components/UserAvatar";

type UsersPageProps = {
  role: string; // "student", "teacher"… : fixé par la route
  title: string;
  description: string;
  singular: string; // « étudiant » (libellés de recherche et d'actions)
};

const fullName = (user: AdminUser) => `${user.first_name} ${user.last_name}`.trim();

export function UsersPage({ role, title, description, singular }: UsersPageProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useAdminSearch();
  const onQ = useCallback((value: string) => setSearch({ q: value }), [setSearch]);
  const [q, setQ] = useDebouncedQ(search.q, onQ);

  const { data, isLoading, error, refetch } = useAdminList<AdminUser>("users", "/users/", {
    page: search.page ?? 1,
    page_size: search.page_size ?? 20,
    q: search.q,
    statut: search.statut,
    role,
  });

  const openProfile = (user: AdminUser) =>
    void navigate({ to: "/membres/$userId", params: { userId: user.id } });

  const columns: Column<AdminUser>[] = [
    {
      header: "Identité",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <UserAvatar name={fullName(user)} url={user.avatar_url ?? null} />
          <div className="min-w-0">
            <p className="truncate font-medium">{fullName(user)}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    { header: "Statut", cell: (user) => <StatusBadge statut={user.statut} /> },
    { header: "Inscrit le", cell: (user) => fmtDate(user.created_at) },
    {
      header: "Actions",
      className: "w-16 text-right",
      cell: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Actions pour ${fullName(user)}`}>
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/membres/$userId" params={{ userId: user.id }}>
                <UserRound /> Voir le profil
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Filet de sécurité : si le serveur ignorait le paramètre `role`, on n'affiche que le bon rôle.
  const rows = data?.items.filter((user) => user.role === role);

  return (
    <>
      <PageHeader title={title} description={description} />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-72">
          <SearchInput value={q} onChange={setQ} label={`Rechercher un ${singular}`} />
        </div>
        <div className="w-full sm:w-48">
          <SimpleSelect
            id="filtre-statut"
            placeholder="Statut"
            value={search.statut}
            onChange={(value) => setSearch({ statut: value })}
            options={STATUT_OPTIONS}
            allLabel="Tous les statuts"
          />
        </div>
      </div>

      <DataTable
        caption={`Liste des ${singular}s`}
        columns={columns}
        rows={rows}
        loading={isLoading}
        error={error}
        onRowClick={openProfile}
        onRetry={() => void refetch()}
        empty={
          <p className="py-10 text-center text-sm text-muted-foreground">
            Aucun {singular} ne correspond.
          </p>
        }
        pagination={
          data
            ? {
                page: data.page,
                pages: data.pages,
                total: data.total,
                pageSize: data.page_size,
                onPage: (page) => setSearch({ page }, false),
                onPageSize: (page_size) => setSearch({ page_size }),
              }
            : undefined
        }
      />
    </>
  );
}
