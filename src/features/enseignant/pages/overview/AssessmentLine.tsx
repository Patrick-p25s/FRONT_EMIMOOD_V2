// pages/overview/AssessmentLine.tsx
import { Link } from "@tanstack/react-router";
import { ClipboardCheck } from "lucide-react";
import { IconBox } from "@/components/emimood/atoms/IconBox";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { fmtDateTime } from "@/lib/format";
import type { AssessmentRow } from "../../hooks/useTeachingAssessments";
import { ASSESSMENT_TYPE_LABEL, phaseMeta } from "../../lib/assessmentMeta";

export function AssessmentLine({ row }: { row: AssessmentRow }) {
  const phase = phaseMeta(row.phase);
  return (
    <Link
      to="/enseignant/evaluations/$assessmentId"
      params={{ assessmentId: row.id }}
      className="flex items-center gap-3 rounded-xl border bg-card p-3 no-underline shadow-(--shadow) transition-colors hover:border-primary/40"
    >
      <IconBox icon={ClipboardCheck} tone="info" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-foreground">{row.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {row.subject_name} · {row.classe_name} · {ASSESSMENT_TYPE_LABEL[row.assessment_type]}
          {row.end_at ? ` · fin ${fmtDateTime(row.end_at)}` : ""}
        </p>
      </div>
      {row.pending ? <StatusPill tone="warning">{row.pending} à corriger</StatusPill> : null}
      <StatusPill tone={phase.tone}>{phase.label}</StatusPill>
    </Link>
  );
}
