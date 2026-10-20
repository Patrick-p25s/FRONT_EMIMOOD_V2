// pages/universities/UniversitiesPage.tsx
import { useCallback, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { Logo } from "@/components/emimood/atoms/Logo";
import { SearchInput, SimpleSelect } from "@/components/emimood/molecules/filters";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";
import { StatusBadge } from "@/components/emimood/molecules/StatusBadge";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { DataTable, type Column } from "@/components/emimood/organisms/DataTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { statutLabel, type Statut } from "@/lib/domain";
import { fmtDate } from "@/lib/format";
import type { University } from "../../api/types";
import { useAdminList } from "../../hooks/useAdminList";
import { useAdminSearch, useDebouncedQ } from "../../hooks/useAdminSearch";
import { useUniversityMutations } from "../../hooks/useUniversityMutations";
import { UniversityForm } from "./UniversityForm";
import { useNavigate } from "@tanstack/react-router";
import { keepU } from "../../lib/search";
import { STATUT_OPTIONS, TRANSITIONS } from "../../lib/statut";

type FormTarget = { kind: "create" } | { kind: "edit"; university: University };
type StatutChange = { university: University; statut: Statut; label: string; destructive: boolean };

export function UniversitiesPage() {
  const [search, setSearch] = useAdminSearch();
  const onQ = useCallback((value: string) => setSearch({ q: value }), [setSearch]);
  const [q, setQ] = useDebouncedQ(search.q, onQ);

  const [target, setTarget] = useState<FormTarget | null>(null);
  const [change, setChange] = useState<StatutChange | null>(null);
  const { setStatut } = useUniversityMutations();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useAdminList<University>(
    "universities",
    "/universities/",
    {
      page: search.page ?? 1,
      page_size: search.page_size ?? 20,
      q: search.q,
      statut: search.statut,
    },
  );

  const columns: Column<University>[] = [
    {
      header: "Université",
      cell: (university) => (
        <div onClick={(event) => event.stopPropagation()}>
          <DropdownMenu>
            <div className="flex items-center gap-3">
              <Logo url={university.logo_url} name={university.name} />
              <div className="min-w-0">
                <p className="truncate font-medium">{university.name}</p>
                <p className="text-xs text-muted-foreground">{university.code}</p>
              </div>
            </div>
          </DropdownMenu>
        </div>
      ),
    },
    { header: "Statut", cell: (university) => <StatusBadge statut={university.statut} /> },
    { header: "Créée le", cell: (university) => fmtDate(university.created_at) },
    {
      header: "Actions",
      className: "w-16 text-right",
      cell: (university) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`Actions pour ${university.name}`}>
              <MoreHorizontal className="size-4" aria-hidden />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setTarget({ kind: "edit", university })}>
              Modifier
            </DropdownMenuItem>
            {TRANSITIONS[university.statut].map((transition) => (
              <DropdownMenuItem
                key={transition.statut}
                onSelect={() => setChange({ university, ...transition })}
              >
                {transition.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Universités"
        description="Créez et gérez les universités de la plateforme."
        actions={
          <Button onClick={() => setTarget({ kind: "create" })}>
            <Plus className="size-4" aria-hidden /> Nouvelle université
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-72">
          <SearchInput value={q} onChange={setQ} label="Rechercher une université" />
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
        caption="Liste des universités"
        columns={columns}
        rows={data?.items}
        loading={isLoading}
        error={error}

        onRetry={() => void refetch()}
        empty={
          <p className="py-10 text-center text-sm text-muted-foreground">
            Aucune université ne correspond.
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

      <Dialog open={target !== null} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {target?.kind === "edit" ? "Modifier l’université" : "Nouvelle université"}
            </DialogTitle>
            <DialogDescription>
              {target?.kind === "edit"
                ? "Mettez à jour les informations."
                : "Renseignez les informations de base."}
            </DialogDescription>
          </DialogHeader>
          {target && (
            <UniversityForm
              key={target.kind === "edit" ? target.university.id : "new"}
              university={target.kind === "edit" ? target.university : undefined}
              onDone={() => setTarget(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={change !== null}
        onOpenChange={(open) => !open && setChange(null)}
        title={change ? `${change.label} « ${change.university.name} » ?` : ""}
        description="Ce changement s’applique tout de suite à toute l’université."
        confirmLabel={change?.label ?? "Confirmer"}
        destructive={change?.destructive === true}
        onConfirm={async () => {
          if (!change) return;
          try {
            await setStatut.mutateAsync({ id: change.university.id, statut: change.statut });
            setChange(null);
          } catch {
            // le message d'erreur est déjà affiché par la mutation ; la boîte reste ouverte
          }
        }}
      />
    </>
  );
}
