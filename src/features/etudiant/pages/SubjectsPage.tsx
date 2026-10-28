import { useState } from "react";
import { Heading } from "@/components/emimood/molecules/Heading";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { SubjectCard } from "./SubjectCard";
import { useStudentSubjects } from "../hooks/useStudentCourses";
import { isNotFound } from "@tanstack/react-router";

export function SubjectsPage() {
  const [semester, setSemester] = useState<number | undefined>(undefined);
  const query = useStudentSubjects(semester);
  const data = query.data;

  return (
    <div className="page">
      <Heading title="Mes matières" subtitle="Votre semestre, une connaissance à la fois." />

      {query.error && !data ? (
        isNotFound(query.error) ? (
          <EmptyState
            title="Vous n’êtes dans aucune classe"
            description="Contactez l’administration de votre université pour être rattaché à votre classe."
          />
        ) : (
          <ErrorState error={query.error} onRetry={() => void query.refetch()} />
        )
      ) : !data ? (
        <div className="content-grid">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-64 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="filter-row">
            <span className="tag">{data.classe_name}</span>
            {semester !== undefined && <span className="tag">Semestre {semester}</span>}
            <span className="small">Année universitaire {data.academic_year_name}</span>
          </div>

          {data.semesters.length > 1 && (
            <div
              className="my-4 flex flex-wrap gap-1"
              role="group"
              aria-label="Choisir un semestre"
            >
              <Button
                size="sm"
                variant={semester === undefined ? "default" : "outline"}
                aria-pressed={semester === undefined}
                onClick={() => setSemester(undefined)}
              >
                Tous
              </Button>
              {data.semesters.map((value) => (
                <Button
                  key={value}
                  size="sm"
                  variant={semester === value ? "default" : "outline"}
                  aria-pressed={semester === value}
                  onClick={() => setSemester(value)}
                >
                  Semestre {value}
                </Button>
              ))}
            </div>
          )}

          {data.subjects.length === 0 ? (
            <EmptyState
              title="Aucune matière"
              description="Aucune matière n’est disponible pour ce semestre."
            />
          ) : (
            <div className="content-grid">
              {data.subjects.map((subject) => (
                <SubjectCard key={subject.class_subject_id} subject={subject} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
