import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Heading } from "@/components/emimood/molecules/Heading";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
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
import { useStartAttempt } from "../../hooks/useAttempts";
import { PHASE_LABEL, isOpenAttempt, typeLabel } from "../../lib/assessments";
import { isNotFound } from "../../lib/messages";
import { StudentAssessmentRow, useStudentAssessments } from "../../hooks/useStudentAttempts";
import { ResultsList } from "./ResultsList";

type Tab = "upcoming" | "results";

function dateLine(row: StudentAssessmentRow): string {
  if (row.phase === "upcoming" && row.start_at) return `Ouvre le ${fmtDateTime(row.start_at)}`;
  return row.end_at ? `Jusqu’au ${fmtDateTime(row.end_at)}` : "Sans date limite";
}

export function EvaluationsPage() {
  const navigate = useNavigate();
  const { rows, isLoading, error, refetch } = useStudentAssessments();
  const start = useStartAttempt();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [info, setInfo] = useState<StudentAssessmentRow | null>(null);
  const [starting, setStarting] = useState<StudentAssessmentRow | null>(null);

  const upcoming = rows
    .filter((row) => row.phase === "upcoming" || row.phase === "open")
    .sort((a, b) => (a.end_at ?? "9").localeCompare(b.end_at ?? "9"));

  const action = (row: StudentAssessmentRow) => {
    const attempts = row.attempts ?? [];
    const resumable = attempts.find(isOpenAttempt);
    if (row.phase === "upcoming") return <Button disabled>Pas encore ouverte</Button>;
    if (resumable) {
      return (
        <Link
          to="/evaluations/attempt/$attemptId"
          params={{ attemptId: resumable.id }}
          className="inline-flex"
        >
          <Button>
            Reprendre <ArrowRight />
          </Button>
        </Link>
      );
    }
    if (row.attempts === null) return <Button disabled>Chargement…</Button>;
    if (attempts.length >= row.max_attempts)
      return <span className="tag">Tentatives épuisées</span>;
    return (
      <Button onClick={() => setStarting(row)}>
        Commencer <ArrowRight />
      </Button>
    );
  };

  return (
    <div className="page">
      <Heading
        title="Mes évaluations"
        subtitle="Préparez votre prochaine étape et retrouvez vos résultats."
      />

      <div className="filter-row">
        {(
          [
            ["upcoming", "À venir"],
            ["results", "Résultats"],
          ] as const
        ).map(([value, label]) => (
          <Button
            key={value}
            variant={tab === value ? "secondary" : "outline"}
            onClick={() => setTab(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {error ? (
        isNotFound(error) ? (
          <EmptyState
            title="Vous n’êtes dans aucune classe"
            description="Contactez l’administration de votre université."
          />
        ) : (
          <ErrorState error={error} onRetry={refetch} />
        )
      ) : isLoading ? (
        <div className="content-grid">
          {[0, 1].map((key) => (
            <Skeleton key={key} className="h-48 w-full" />
          ))}
        </div>
      ) : tab === "upcoming" ? (
        upcoming.length === 0 ? (
          <EmptyState
            title="Aucune évaluation à venir"
            description="Vos prochaines évaluations apparaîtront ici dès leur publication."
          />
        ) : (
          <div className="content-grid">
            {upcoming.map((row) => {
              const left = row.attempts
                ? Math.max(0, row.max_attempts - row.attempts.length)
                : null;
              return (
                <article className="item-card" key={row.id}>
                  <span className={row.phase === "upcoming" ? "tag warm" : "tag"}>
                    {PHASE_LABEL[row.phase] ?? row.phase}
                  </span>
                  <h2>{row.title}</h2>
                  <p>
                    {row.subject_name} · {typeLabel(row.assessment_type)}
                  </p>
                  <p>{dateLine(row)}</p>
                  <p>
                    {row.duration_minutes
                      ? `${row.duration_minutes} minutes`
                      : "Sans limite de durée"}
                    {" · "}
                    {left === null
                      ? `${row.max_attempts} tentative(s)`
                      : `${left}/${row.max_attempts} tentative(s) restante(s)`}
                    <br />
                    En ligne
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {action(row)}
                    <Button variant="outline" onClick={() => setInfo(row)}>
                      Informations
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )
      ) : (
        <ResultsList rows={rows} />
      )}

      <Dialog open={info !== null} onOpenChange={(open) => !open && setInfo(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {info ? typeLabel(info.assessment_type) : ""} · {info?.title}
            </DialogTitle>
            <DialogDescription>{info?.subject_name}</DialogDescription>
          </DialogHeader>
          {info?.description && <p className="whitespace-pre-line">{info.description}</p>}
          <p className="small">
            {info?.duration_minutes ? `${info.duration_minutes} minutes` : "Sans limite de durée"} ·{" "}
            {info?.max_attempts} tentative(s) autorisée(s)
            {info?.show_correction ? " · correction visible après l’évaluation" : ""}
          </p>
          {info && (
            <Link
              to="/cours/$classSubjectId"
              params={{ classSubjectId: info.class_subject_id }}
              className="text-success flex items-center gap-2"
            >
              Réviser mes cours
              <ArrowRight size={16} />
            </Link>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={starting !== null}
        onOpenChange={(open) => !open && setStarting(null)}
        title={`Commencer « ${starting?.title ?? ""} » ?`}
        description={
          starting?.duration_minutes
            ? `Le chronomètre de ${starting.duration_minutes} minutes démarre tout de suite et continue même si vous quittez la page. Vos réponses sont enregistrées au fur et à mesure.`
            : "Vos réponses sont enregistrées au fur et à mesure : vous pourrez reprendre si vous quittez la page."
        }
        confirmLabel="Commencer"
        onConfirm={async () => {
          if (!starting) return;
          try {
            const attempt = await start.mutateAsync(starting.id);
            setStarting(null);
            void navigate({
              to: "/evaluations/attempt/$attemptId",
              params: { attemptId: attempt.id },
            });
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </div>
  );
}
