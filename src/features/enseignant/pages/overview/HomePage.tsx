// pages/overview/HomePage.tsx
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { ErrorState } from "@/components/emimood/molecules/states";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { useTeachingAssessments } from "../../hooks/useTeachingAssessments";
import { AssessmentLine } from "./AssessmentLine";

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border bg-card p-3 shadow-(--shadow)">
      <p className="text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-bold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function HomePage() {
  const { user } = useAuth();
  const { rows, subjects, isLoading, error, refetch } = useTeachingAssessments();

  if (error) return <ErrorState error={error} onRetry={refetch} />;

  const toGrade = rows.filter((row) => (row.pending ?? 0) > 0);
  const drafts = rows.filter((row) => row.status === "draft");
  const todo = [...toGrade, ...drafts].slice(0, 5);
  const live = rows
    .filter((row) => row.phase === "open" || row.phase === "upcoming")
    .sort((a, b) => (a.end_at ?? "9").localeCompare(b.end_at ?? "9"))
    .slice(0, 4);

  const pendingTotal = toGrade.reduce((sum, row) => sum + (row.pending ?? 0), 0);
  const openCount = rows.filter((row) => row.phase === "open").length;

  return (
    <>
      <PageHeader
        title={user ? `Bonjour, ${user.name}` : "Bonjour"}
        description="Voici ce qui vous attend aujourd’hui."
      />

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="grid gap-8">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Matières" value={subjects.length} />
            <Stat label="Évaluations en cours" value={openCount} />
            <Stat label="Copies à corriger" value={pendingTotal} />
          </div>

          <Section title="À faire maintenant">
            {todo.length === 0 ? (
              <p className="flex items-center gap-2 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-success" aria-hidden /> Rien d’urgent : aucune
                copie à corriger, aucun brouillon en attente.
              </p>
            ) : (
              <ul className="grid gap-2">
                {todo.map((row) => (
                  <li key={row.id}>
                    <AssessmentLine row={row} />
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {live.length > 0 && (
            <Section
              title="En cours et à venir"
              action={
                <Link
                  to="/enseignant/evaluations"
                  className="text-sm text-primary no-underline hover:underline"
                >
                  Tout voir
                </Link>
              }
            >
              <ul className="grid gap-2">
                {live.map((row) => (
                  <li key={row.id}>
                    <AssessmentLine row={row} />
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section
            title="Mes matières"
            action={
              <Link
                to="/enseignant/matieres"
                className="text-sm text-primary no-underline hover:underline"
              >
                Tout voir
              </Link>
            }
          >
            {subjects.length === 0 ? (
              <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
                Aucune matière pour le moment.
              </p>
            ) : (
              <ul className="grid gap-3 sm:grid-cols-2">
                {subjects.map((entry) => (
                  <li
                    key={entry.subject.id}
                    className="rounded-xl border bg-card p-4 shadow-(--shadow)"
                  >
                    <p className="truncate font-bold">{entry.subject.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {entry.classes.map((assignment) => (
                        <Link
                          key={assignment.id}
                          to="/enseignant/matieres/$classSubjectId"
                          params={{ classSubjectId: assignment.class_subject_id }}
                          className="rounded-full border px-2.5 py-0.5 text-xs no-underline transition-colors hover:border-primary/40 hover:text-primary"
                        >
                          {assignment.classe_name}
                          {assignment.semester !== null ? ` · S${assignment.semester}` : ""}
                        </Link>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      )}
    </>
  );
}
