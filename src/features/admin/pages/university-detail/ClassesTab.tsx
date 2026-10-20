// pages/university-detail/ClassesTab.tsx
import { useCallback, useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import { SearchInput, SimpleSelect } from "@/components/emimood/molecules/filters";
import { StatusBadge } from "@/components/emimood/molecules/StatusBadge";
import { ConfirmDialog, OnceSecretDialog } from "@/components/emimood/organisms/dialogs";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fmtDate } from "@/lib/format";
import type { Classe } from "../../api/types";
import { useAdminList } from "../../hooks/useAdminList";
import { useAdminSearch, useDebouncedQ } from "../../hooks/useAdminSearch";
import { useClassMutations } from "../../hooks/useClassMutations";
import { useYears } from "../../hooks/resources";
import { STATUT_OPTIONS, TRANSITIONS } from "../../lib/statut";
import { ClassForm } from "./ClassForm";
import { ClassSubjectsPanel } from "./ClassSubjectsPanel";

type FormTarget = { kind: "create" } | { kind: "edit"; classe: Classe };
type StatutChange = {
  classe: Classe;
  statut: Classe["statut"];
  label: string;
  destructive: boolean;
};
type Secret = { title: string; value: string };

export function ClassesTab({ universityId }: { universityId: string }) {
  const [search, setSearch] = useAdminSearch();
  const onQ = useCallback((value: string) => setSearch({ q: value }), [setSearch]);
  const [q, setQ] = useDebouncedQ(search.q, onQ);

  const years = useYears();
  const yearItems = years.data?.items ?? [];
  const yearId = search.year ?? yearItems.find((year) => year.is_current)?.id ?? yearItems[0]?.id;

  const [target, setTarget] = useState<FormTarget | null>(null);
  const [subjectsOf, setSubjectsOf] = useState<Classe | null>(null);
  const [change, setChange] = useState<StatutChange | null>(null);
  const [toRegenerate, setToRegenerate] = useState<Classe | null>(null);
  const [secret, setSecret] = useState<Secret | null>(null);
  const { setStatut, regenerate, reveal } = useClassMutations();

  const { data, isLoading, error, refetch } = useAdminList<Classe>(
    "classes",
    "/classes/",
    {
      university_id: universityId,
      academic_year_id: yearId,
      statut: search.statut,
      q: search.q,
      page: search.page ?? 1,
      page_size: search.page_size ?? 20,
    },
    !!yearId,
  );

  const columns: Column<Classe>[] = [
    {
      header: "Classe",
      cell: (classe) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{classe.name}</p>
          <p className="text-xs text-muted-foreground">
            {classe.mention} · {classe.level}
          </p>
        </div>
      ),
    },
    { header: "Code", cell: (classe) => classe.code },
    { header: "Statut", cell: (classe) => <StatusBadge statut={classe.statut} /> },
    { header: "Créée le", cell: (classe) => fmtDate(classe.created_at) },
    {
      header: "Actions",
      className: "w-16 text-right",
      cell: (classe) => (
        <div onClick={(event) => event.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions pour ${classe.name}`}>
                <MoreHorizontal className="size-4" aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setTarget({ kind: "edit", classe })}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setSubjectsOf(classe)}>
                Matières et enseignants
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() =>
                  reveal.mutate(classe.id, {
                    onSuccess: (result) =>
                      setSecret({
                        title: `Code d’invitation de ${classe.name}`,
                        value: result.code_invitation,
                      }),
                  })
                }
              >
                Voir le code d’invitation
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setToRegenerate(classe)}>
                Régénérer le code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {TRANSITIONS[classe.statut].map((transition) => (
                <DropdownMenuItem
                  key={transition.statut}
                  onSelect={() => setChange({ classe, ...transition })}
                >
                  {transition.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-full sm:w-48">
          <SimpleSelect
            id="classes-year"
            placeholder="Année"
            value={yearId}
            onChange={(value) => setSearch({ year: value })}
            options={yearItems.map((year) => ({
              value: year.id,
              label: year.is_current ? `${year.name} (courante)` : year.name,
            }))}
          />
        </div>
        <div className="w-full sm:w-64">
          <SearchInput value={q} onChange={setQ} label="Rechercher une classe" />
        </div>
        <div className="w-full sm:w-44">
          <SimpleSelect
            id="classes-statut"
            placeholder="Statut"
            value={search.statut}
            onChange={(value) => setSearch({ statut: value })}
            options={STATUT_OPTIONS}
            allLabel="Tous les statuts"
          />
        </div>
        <Button
          className="ml-auto"
          disabled={!yearId}
          onClick={() => setTarget({ kind: "create" })}
        >
          <Plus className="size-4" aria-hidden /> Nouvelle classe
        </Button>
      </div>

      <DataTable
        caption="Classes de l’université"
        columns={columns}
        rows={data?.items}
        loading={isLoading || years.isLoading}
        error={error ?? years.error}
        onRetry={() => void refetch()}
        empty={
          <p className="py-10 text-center text-sm text-muted-foreground">
            {yearId ? "Aucune classe pour cette année." : "Créez d’abord une année académique."}
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
              {target?.kind === "edit" ? "Modifier la classe" : "Nouvelle classe"}
            </DialogTitle>
            <DialogDescription>
              {target?.kind === "edit"
                ? "Seuls le nom et la description sont modifiables."
                : "Le code d’invitation sera affiché une seule fois."}
            </DialogDescription>
          </DialogHeader>
          {target && (
            <ClassForm
              key={target.kind === "edit" ? target.classe.id : "new"}
              universityId={universityId}
              years={yearItems}
              defaultYearId={yearId}
              classe={target.kind === "edit" ? target.classe : undefined}
              onDone={() => setTarget(null)}
              onCreated={(value) => {
                setTarget(null);
                setSecret({ title: "Classe créée : code d’invitation", value });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={change !== null}
        onOpenChange={(open) => !open && setChange(null)}
        title={change ? `${change.label} « ${change.classe.name} » ?` : ""}
        description="Ce changement s’applique tout de suite à la classe."
        confirmLabel={change?.label ?? "Confirmer"}
        destructive={change?.destructive === true}
        onConfirm={async () => {
          if (!change) return;
          try {
            await setStatut.mutateAsync({ id: change.classe.id, statut: change.statut });
            setChange(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />

      <ConfirmDialog
        open={toRegenerate !== null}
        onOpenChange={(open) => !open && setToRegenerate(null)}
        title={toRegenerate ? `Régénérer le code de « ${toRegenerate.name} » ?` : ""}
        description="L’ancien code cessera de fonctionner immédiatement. Les étudiants déjà inscrits ne sont pas affectés."
        confirmLabel="Régénérer"
        destructive
        onConfirm={async () => {
          if (!toRegenerate) return;
          try {
            const result = await regenerate.mutateAsync(toRegenerate.id);
            setToRegenerate(null);
            setSecret({
              title: `Nouveau code de ${toRegenerate.name}`,
              value: result.code_invitation,
            });
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />

      <Dialog open={subjectsOf !== null} onOpenChange={(open) => !open && setSubjectsOf(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{subjectsOf ? `Matières de ${subjectsOf.name}` : ""}</DialogTitle>
            <DialogDescription>
              Ajoutez des matières, puis affectez-leur des enseignants.
            </DialogDescription>
          </DialogHeader>
          {subjectsOf && <ClassSubjectsPanel classe={subjectsOf} universityId={universityId} />}
        </DialogContent>
      </Dialog>

      <OnceSecretDialog
        secret={secret?.value ?? null}
        title={secret?.title ?? ""}
        onClose={() => setSecret(null)}
      />
    </div>
  );
}
