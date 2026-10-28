// pages/assessments/AssessmentsTab.tsx
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ClipboardCheck, Plus } from "lucide-react";
import { IconBox } from "@/components/emimood/atoms/IconBox";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { fmtDateTime } from "@/lib/format";
import { useAssessments } from "../../hooks/useAssessments";
import { ASSESSMENT_TYPE_LABEL, phaseMeta } from "../../lib/assessmentMeta";
import { AssessmentForm } from "./AssessmentForm";

export function AssessmentsTab({ classSubjectId }: { classSubjectId: string }) {
  const navigate = useNavigate();
  const assessments = useAssessments(classSubjectId);
  const [creating, setCreating] = useState(false);
  const list = assessments.data ?? [];

  return (
    <div className="grid gap-4">
      <div className="flex justify-end">
        <Button onClick={() => setCreating(true)}>
          <Plus className="size-4" aria-hidden /> Nouvelle évaluation
        </Button>
      </div>

      {assessments.error ? (
        <ErrorState error={assessments.error} onRetry={() => void assessments.refetch()} />
      ) : assessments.isLoading ? (
        <Skeleton className="h-20 w-full" />
      ) : list.length === 0 ? (
        <EmptyState
          title="Aucune évaluation pour le moment"
          description="Créez un quiz, un examen ou un devoir, ajoutez-y des questions, puis publiez-le."
          action={<Button onClick={() => setCreating(true)}>Créer la première évaluation</Button>}
        />
      ) : (
        <ul className="grid gap-2">
          {list.map((assessment) => {
            const phase = phaseMeta(assessment.phase);
            return (
              <li key={assessment.id}>
                <Link
                  to="/enseignant/evaluations/$assessmentId"
                  params={{ assessmentId: assessment.id }}
                  className="flex items-center gap-3 rounded-xl border bg-card p-4 no-underline shadow-(--shadow) transition-colors hover:border-primary/40"
                >
                  <IconBox icon={ClipboardCheck} tone="info" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-foreground">{assessment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ASSESSMENT_TYPE_LABEL[assessment.assessment_type]}
                      {assessment.duration_minutes ? ` · ${assessment.duration_minutes} min` : ""}
                      {assessment.end_at ? ` · fin ${fmtDateTime(assessment.end_at)}` : ""}
                    </p>
                  </div>
                  <StatusPill tone={phase.tone}>{phase.label}</StatusPill>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Nouvelle évaluation</DialogTitle>
            <DialogDescription>
              Elle est créée en brouillon. Vous y ajouterez les questions ensuite.
            </DialogDescription>
          </DialogHeader>
          <AssessmentForm
            classSubjectId={classSubjectId}
            onCancel={() => setCreating(false)}
            onSaved={(created) => {
              setCreating(false);
              void navigate({
                to: "/enseignant/evaluations/$assessmentId",
                params: { assessmentId: created.id },
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
