// pages/overview/EvaluationsPage.tsx
import { useState } from "react";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeachingAssessments, type AssessmentRow } from "../../hooks/useTeachingAssessments";
import { AssessmentLine } from "./AssessmentLine";

type Filter = "all" | "to_grade" | "draft" | "open" | "upcoming" | "closed";

const FILTERS: { value: Filter; label: string; match: (row: AssessmentRow) => boolean }[] = [
  { value: "all", label: "Toutes", match: () => true },
  { value: "to_grade", label: "À corriger", match: (row) => (row.pending ?? 0) > 0 },
  { value: "draft", label: "Brouillons", match: (row) => row.status === "draft" },
  { value: "open", label: "En cours", match: (row) => row.phase === "open" },
  { value: "upcoming", label: "À venir", match: (row) => row.phase === "upcoming" },
  {
    value: "closed",
    label: "Terminées",
    match: (row) => row.phase === "closed" || row.status === "archived",
  },
];

export function EvaluationsPage() {
  const { rows, isLoading, error, refetch } = useTeachingAssessments();
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const text = query.trim().toLowerCase();
  const matchesText = (row: AssessmentRow) =>
    text === "" ||
    `${row.title} ${row.subject_name} ${row.classe_name}`.toLowerCase().includes(text);

  const current = FILTERS.find((entry) => entry.value === filter) ?? FILTERS[0];
  const visible = rows
    .filter((row) => (current ? current.match(row) : true) && matchesText(row))
    .sort(
      (a, b) => (b.pending ?? 0) - (a.pending ?? 0) || b.created_at.localeCompare(a.created_at),
    );

  return (
    <>
      <PageHeader
        title="Évaluations"
        description="Toutes vos évaluations, toutes matières confondues. Pour en créer une, ouvrez la matière concernée."
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Filtrer les évaluations">
          {FILTERS.map((entry) => (
            <Button
              key={entry.value}
              size="sm"
              variant={filter === entry.value ? "default" : "outline"}
              onClick={() => setFilter(entry.value)}
            >
              {entry.label}{" "}
              <span className="ml-1 opacity-70">{rows.filter(entry.match).length}</span>
            </Button>
          ))}
        </div>
        <Input
          className="w-full sm:w-64"
          placeholder="Rechercher…"
          aria-label="Rechercher une évaluation"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {error ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : visible.length === 0 ? (
        <EmptyState
          title={rows.length === 0 ? "Aucune évaluation pour le moment" : "Aucun résultat"}
          description={
            rows.length === 0
              ? "Créez-en une depuis l’onglet Évaluations d’une de vos matières."
              : "Essayez un autre filtre."
          }
        />
      ) : (
        <ul className="grid gap-2">
          {visible.map((row) => (
            <li key={row.id}>
              <AssessmentLine row={row} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
