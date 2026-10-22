// hooks/useTeachingAssessments.ts
import { useQueries } from "@tanstack/react-query";
import { assessmentsApi } from "../api/assessments";
import { attemptsApi } from "../api/attempts";
import type { Assessment } from "../api/types";
import { teacherKeys } from "../keys";
import { useMySubjects } from "./useMySubjects";

export type AssessmentRow = Assessment & {
  subject_name: string;
  classe_name: string;
  pending: number | null;
};

export function useTeachingAssessments() {
  const subjects = useMySubjects();

  // Une entrée par « matière dans une classe ».
  const assignments = (subjects.data ?? []).flatMap((entry) => entry.classes);
  const unique = [...new Map(assignments.map((a) => [a.class_subject_id, a] as const)).values()];

  const lists = useQueries({
    queries: unique.map((a) => ({
      queryKey: teacherKeys.assessmentsOf(a.class_subject_id),
      queryFn: () => assessmentsApi.list(a.class_subject_id),
    })),
  });

  const base = lists.flatMap((query, index) => {
    const assignment = unique[index];
    if (!assignment) return [];
    return (query.data ?? []).map((item) => ({
      ...item,
      subject_name: assignment.subject_name,
      classe_name: assignment.classe_name,
    }));
  });

  // Seules les évaluations publiées peuvent avoir des copies.
  const published = base.filter((item) => item.status === "published");
  const results = useQueries({
    queries: published.map((item) => ({
      queryKey: teacherKeys.results(item.id),
      queryFn: () => attemptsApi.results(item.id),
      staleTime: 30_000,
    })),
  });
  const pendingById = new Map(
    published.map(
      (item, index) => [item.id, results[index]?.data?.pending_attempts ?? null] as const,
    ),
  );

  const rows: AssessmentRow[] = base.map((item) => ({
    ...item,
    pending: pendingById.get(item.id) ?? null,
  }));

  return {
    rows,
    subjects: subjects.data ?? [],
    isLoading: subjects.isLoading || lists.some((query) => query.isLoading),
    error: (subjects.error ?? lists.find((query) => query.error)?.error ?? null) as Error | null,
    refetch: () => {
      void subjects.refetch();
      lists.forEach((query) => void query.refetch());
    },
  };
}
