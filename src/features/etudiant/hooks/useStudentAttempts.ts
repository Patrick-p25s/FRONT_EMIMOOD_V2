import { useQueries } from "@tanstack/react-query";
import type { MyAttempt, StudentAssessment } from "../api/assessmentSchemas";
import { studentAssessmentsApi } from "../api/assessments";
import { studentKeys } from "../keys";
import { retryPolicy } from "../lib/messages";
import { useStudentSubjects } from "./useStudentCourses";

export type StudentAssessmentRow = StudentAssessment & {
  subject_name: string;
  attempts: MyAttempt[] | null;
};

export function useStudentAssessments() {
  const subjects = useStudentSubjects(undefined);
  const cards = subjects.data?.subjects ?? [];

  const lists = useQueries({
    queries: cards.map((card) => ({
      queryKey: studentKeys.assessmentsOf(card.class_subject_id),
      queryFn: () => studentAssessmentsApi.list(card.class_subject_id),
      retry: retryPolicy,
    })),
  });

  const base = lists.flatMap((query, index) => {
    const card = cards[index];
    return card ? (query.data ?? []).map((item) => ({ ...item, subject_name: card.name })) : [];
  });

  // Une évaluation pas encore ouverte n'a pas de tentatives à chercher.
  const started = base.filter((item) => item.phase !== "upcoming" && item.phase !== "draft");
  const attempts = useQueries({
    queries: started.map((item) => ({
      queryKey: studentKeys.attemptsOf(item.id),
      queryFn: () => studentAssessmentsApi.myAttempts(item.id),
      retry: retryPolicy,
    })),
  });
  const byId = new Map(
    started.map((item, index) => [item.id, attempts[index]?.data ?? null] as const),
  );

  const rows: StudentAssessmentRow[] = base.map((item) => ({
    ...item,
    attempts: byId.get(item.id) ?? null,
  }));

  return {
    rows,
    isLoading: subjects.isLoading || lists.some((query) => query.isLoading),
    error: (subjects.error ?? lists.find((query) => query.error)?.error ?? null) as Error | null,
    refetch: () => {
      void subjects.refetch();
      lists.forEach((query) => void query.refetch());
    },
  };
}
