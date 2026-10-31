import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { Panel } from "@/components/emimood/molecules/Panel";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDateTime } from "@/lib/format";
import { useAssessmentResults, useAttempts } from "../../hooks/useAttempts";
import { attemptStatusMeta, formatScore } from "../../lib/attemptMeta";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-3 shadow-(--shadow)">
      <p className="text-xl font-extrabold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function ResultsPanel({ assessmentId }: { assessmentId: string }) {
  const [onlyToGrade, setOnlyToGrade] = useState(true);
  const results = useAssessmentResults(assessmentId);
  const attempts = useAttempts(assessmentId, onlyToGrade ? "submitted" : undefined);
  const stats = results.data;
  const rows = attempts.data ?? [];

  return (
    <div className="grid gap-6">
      {results.error ? (
        <ErrorState error={results.error} onRetry={() => void results.refetch()} />
      ) : !stats ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Étudiants" value={String(stats.students_count)} />
          <Stat label="Copies corrigées" value={String(stats.graded_count)} />
          <Stat label="À corriger" value={String(stats.pending_attempts)} />
          <Stat
            label={`Moyenne /${formatScore(stats.max_score)}`}
            value={formatScore(stats.average)}
          />
        </div>
      )}

      <section aria-labelledby="copies-title">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="copies-title" className="text-[15px] font-bold">
            Copies
          </h2>
          <div className="flex gap-1" role="group" aria-label="Filtre des copies">
            <Button
              size="sm"
              variant={onlyToGrade ? "default" : "outline"}
              onClick={() => setOnlyToGrade(true)}
            >
              À corriger
            </Button>
            <Button
              size="sm"
              variant={onlyToGrade ? "outline" : "default"}
              onClick={() => setOnlyToGrade(false)}
            >
              Toutes
            </Button>
          </div>
        </div>

        {attempts.error ? (
          <ErrorState error={attempts.error} onRetry={() => void attempts.refetch()} />
        ) : attempts.isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : rows.length === 0 ? (
          <EmptyState
            title={onlyToGrade ? "Aucune copie à corriger" : "Aucune copie pour le moment"}
            description="Les copies apparaissent ici dès que les étudiants rendent leur travail."
          />
        ) : (
          <ul className="grid gap-2">
            {rows.map((row) => {
              const status = attemptStatusMeta(row.status);
              return (
                <li key={row.id}>
                  <Link
                    to="/enseignant/copies/$attemptId"
                    params={{ attemptId: row.id }}
                    className="flex items-center gap-3 rounded-xl border bg-card p-3 no-underline shadow-(--shadow) transition-colors hover:border-primary/40"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-foreground">{row.student_name}</p>
                      <p className="text-xs text-muted-foreground">
                        Tentative {row.attempt_number}
                        {row.submitted_at ? ` · rendue ${fmtDateTime(row.submitted_at)}` : ""}
                      </p>
                    </div>
                    {row.score !== null && (
                      <span className="text-sm font-semibold">{formatScore(row.score)}</span>
                    )}
                    <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {stats && stats.students.length > 0 && (
        <Panel title="Notes par étudiant">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Étudiant</th>
                <th className="pb-2 text-right font-medium">Tentatives</th>
                <th className="pb-2 text-right font-medium">Meilleure note</th>
              </tr>
            </thead>
            <tbody>
              {stats.students.map((student) => (
                <tr key={student.student_id} className="border-t">
                  <td className="py-2">
                    {student.student_name}
                    {student.pending > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({student.pending} à corriger)
                      </span>
                    )}
                  </td>
                  <td className="py-2 text-right">{student.attempts}</td>
                  <td className="py-2 text-right font-semibold">
                    {formatScore(student.best_score)} / {formatScore(stats.max_score)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}
