// pages/evaluations/ResultsList.tsx
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { EmptyState } from "@/components/emimood/molecules/states";
import { fmtDateTime } from "@/lib/format";

import { formatScore } from "../../lib/assessments";
import { type StudentAssessmentRow } from "../../hooks/useStudentAttempts";

export function ResultsList({ rows }: { rows: StudentAssessmentRow[] }) {
  const items = rows
    .flatMap((row) =>
      (row.attempts ?? [])
        .filter((attempt) => attempt.submitted_at !== null)
        .map((attempt) => ({ row, attempt })),
    )
    .sort((a, b) => (b.attempt.submitted_at ?? "").localeCompare(a.attempt.submitted_at ?? ""));

  if (items.length === 0)
    return (
      <EmptyState
        title="Aucun résultat pour le moment"
        description="Vos évaluations rendues apparaîtront ici."
      />
    );

  return (
    <div className="document-list">
      {items.map(({ row, attempt }) => (
        <Link
          key={attempt.id}
          to="/evaluations/result/$attemptId"
          params={{ attemptId: attempt.id }}
          className="document-row no-underline"
        >
          <CheckCircle2 className="text-success" />
          <div className="flex-1">
            <h2>{row.title}</h2>
            <p className="small">
              {row.subject_name} · tentative {attempt.attempt_number}
              {attempt.submitted_at ? ` · rendue ${fmtDateTime(attempt.submitted_at)}` : ""}
            </p>
          </div>
          {attempt.score !== null ? (
            <strong className="text-success text-xl">{formatScore(attempt.score)}</strong>
          ) : (
            <span className="tag">En attente de correction</span>
          )}
        </Link>
      ))}
    </div>
  );
}
