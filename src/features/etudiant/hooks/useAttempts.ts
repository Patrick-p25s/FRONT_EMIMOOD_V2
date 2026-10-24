// hooks/useAttempts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentAssessmentsApi } from "../api/assessments";
import { studentKeys } from "../keys";
import { messageOf, retryPolicy } from "../lib/messages";

export const useStudentAssessment = (id: string) =>
  useQuery({
    queryKey: studentKeys.assessment(id),
    queryFn: () => studentAssessmentsApi.get(id),
    retry: retryPolicy,
  });

/** La session ne se recharge pas d'elle-même : les réponses saisies restent locales entre deux sauvegardes. */
export const useAttemptSession = (attemptId: string) =>
  useQuery({
    queryKey: studentKeys.session(attemptId),
    queryFn: () => studentAssessmentsApi.session(attemptId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    retry: retryPolicy,
  });

export const useAttemptResult = (attemptId: string) =>
  useQuery({
    queryKey: studentKeys.result(attemptId),
    queryFn: () => studentAssessmentsApi.result(attemptId),
    retry: retryPolicy,
  });

export function useStartAttempt() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (assessmentId: string) => studentAssessmentsApi.start(assessmentId),
    onSuccess: () => client.invalidateQueries({ queryKey: studentKeys.attemptsAll }),
    onError: (error) => toast.error(messageOf(error)),
  });
}

export function useSubmitAttempt() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) => studentAssessmentsApi.submit(attemptId),
    onSuccess: () => client.invalidateQueries({ queryKey: studentKeys.attemptsAll }),
    onError: (error) => toast.error(messageOf(error)),
  });
}
