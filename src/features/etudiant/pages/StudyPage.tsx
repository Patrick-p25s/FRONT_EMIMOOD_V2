// pages/study/StudyPage.tsx
import { useState } from "react";
import { isNotFound, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChapterList } from "./ChapterList";
import { FinishScreen } from "./FinishScreen";
import { useStudy } from "../hooks/useStudentCourses";
import { useChapterProgress } from "../hooks/useChapterProgress";
import { ProgressBar } from "../components/ProgressBar";
import { ResourceList } from "./RessourceList";

type StudyPageProps = { classSubjectId: string; chapterId?: string | undefined };

const BackLink = () => (
  <Link to="/cours" className={cn(buttonVariants({ variant: "ghost" }), "mb-3 no-underline")}>
    <ArrowLeft /> Toutes les matières
  </Link>
);

export function StudyPage({ classSubjectId, chapterId }: StudyPageProps) {
  const navigate = useNavigate();
  const study = useStudy(classSubjectId);
  const { complete, uncomplete } = useChapterProgress(classSubjectId);
  const [finished, setFinished] = useState<{ subjectCompleted: boolean } | null>(null);

  const data = study.data;
  // Sans chapitre dans l'adresse, ou avec un identifiant inconnu : on reprend là où l'étudiant s'était arrêté.
  const active = data
    ? (data.chapters.find((c) => c.id === chapterId) ??
      data.chapters.find((c) => c.id === data.current_chapter_id) ??
      data.chapters[0])
    : undefined;

  const goTo = (id: string) =>
    void navigate({
      to: "/cours/$classSubjectId/chapters/$chapterId",
      params: { classSubjectId, chapterId: id },
    });

  if (study.error) {
    return (
      <div className="page">
        <BackLink />
        {isNotFound(study.error) ? (
          <EmptyState
            title="Contenu indisponible"
            description="Cette matière n’est plus disponible."
          />
        ) : (
          <ErrorState error={study.error} onRetry={() => void study.refetch()} />
        )}
      </div>
    );
  }

  if (study.isLoading || !data) {
    return (
      <div className="page">
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!active) {
    return (
      <div className="page">
        <BackLink />
        <EmptyState
          title="Aucun chapitre publié pour le moment"
          description="Revenez plus tard : votre enseignant n’a pas encore publié de cours."
        />
      </div>
    );
  }

  const index = data.chapters.findIndex((c) => c.id === active.id);
  const previous = data.chapters[index - 1];
  const next = data.chapters[index + 1];
  const isLast = !next;
  const busy = complete.isPending || uncomplete.isPending;

  const onPrimary = async () => {
    if (active.completed) {
      if (next) goTo(next.id);
      else setFinished({ subjectCompleted: data.completed_chapters === data.total_chapters });
      return;
    }
    try {
      const result = await complete.mutateAsync(active.id);
      if (result.next_chapter_id) goTo(result.next_chapter_id);
      else setFinished({ subjectCompleted: result.subject_completed });
    } catch {
      // toast déjà affiché : on reste sur le chapitre
    }
  };

  const primaryLabel = isLast
    ? "Terminer"
    : active.completed
      ? "Chapitre suivant"
      : "Terminé, chapitre suivant";

  return (
    <div className="page">
      <BackLink />

      <div className="mb-4">
        <div className="small mb-1 flex justify-between">
          <span>{data.subject_name}</span>
          <span>
            {data.completed_chapters} / {data.total_chapters} chapitres
          </span>
        </div>
        <ProgressBar value={data.percent} label={`Progression en ${data.subject_name}`} />
      </div>

      {finished ? (
        <FinishScreen
          subjectName={data.subject_name}
          subjectCompleted={finished.subjectCompleted}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-[260px_1fr]">
          <ChapterList
            classSubjectId={classSubjectId}
            chapters={data.chapters}
            activeId={active.id}
            onSelect={goTo}
          />

          <article className="item-card">
            <span className="tag">
              {data.subject_name} · Chapitre {active.number}
            </span>
            <h2>{active.title}</h2>
            {active.description && <p>{active.description}</p>}

            <ResourceList chapterId={active.id} />

            <div className="mt-5 flex flex-wrap justify-between gap-2">
              <Button
                variant="outline"
                disabled={!previous}
                onClick={() => previous && goTo(previous.id)}
              >
                <ArrowLeft /> Précédent
              </Button>
              <Button disabled={busy} onClick={() => void onPrimary()}>
                {busy ? "Enregistrement…" : primaryLabel}
                {isLast ? <CheckCircle2 /> : <ArrowRight />}
              </Button>
            </div>

            {active.completed && (
              <button
                type="button"
                disabled={busy}
                onClick={() => uncomplete.mutate(active.id)}
                className="small mt-3 w-fit bg-transparent p-0 underline"
              >
                Marquer comme non terminé
              </button>
            )}
          </article>
        </div>
      )}
    </div>
  );
}
