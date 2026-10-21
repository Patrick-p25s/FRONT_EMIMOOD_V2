// hooks/useAssessments.ts
import { useQuery } from "@tanstack/react-query";
import { assessmentsApi, questionsApi } from "../api/assessments";
import { teacherKeys } from "../keys";

export const useAssessments = (classSubjectId: string) =>
  useQuery({
    queryKey: teacherKeys.assessmentsOf(classSubjectId),
    queryFn: () => assessmentsApi.list(classSubjectId),
  });

export const useAssessment = (id: string) =>
  useQuery({ queryKey: teacherKeys.assessment(id), queryFn: () => assessmentsApi.get(id) });

export const useQuestions = (assessmentId: string) =>
  useQuery({
    queryKey: teacherKeys.questions(assessmentId),
    queryFn: () => questionsApi.list(assessmentId),
    select: (list) => [...list].sort((a, b) => a.position - b.position),
  });
