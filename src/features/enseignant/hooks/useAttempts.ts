// hooks/useAttempts.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import { attemptsApi } from "../api/attempts";
import { teacherKeys } from "../keys";

export const useAttempts = (assessmentId: string, status?: string | undefined) =>
  useQuery({
    queryKey: teacherKeys.attempts(assessmentId, status),
    queryFn: () => attemptsApi.list(assessmentId, status),
  });

export const useAttemptReview = (id: string) =>
  useQuery({ queryKey: teacherKeys.attemptReview(id), queryFn: () => attemptsApi.review(id) });

export const useAssessmentResults = (assessmentId: string) =>
  useQuery({
    queryKey: teacherKeys.results(assessmentId),
    queryFn: () => attemptsApi.results(assessmentId),
  });
