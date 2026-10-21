// hooks/useAssessmentMutations.ts
import {
  assessmentsApi,
  questionsApi,
  type CreateAssessmentInput,
  type CreateQuestionInput,
  type UpdateAssessmentInput,
  type UpdateQuestionInput,
} from "../api/assessments";
import type { AssessmentStatus } from "../api/types";
import { teacherKeys } from "../keys";
import { useTeacherMutation } from "./useTeacherMutation";

export function useAssessmentMutations() {
  const refresh = [teacherKeys.assessments];
  const create = useTeacherMutation(
    (input: CreateAssessmentInput) => assessmentsApi.create(input),
    refresh,
    "Évaluation créée",
  );
  const update = useTeacherMutation(
    (v: { id: string; input: UpdateAssessmentInput }) => assessmentsApi.update(v.id, v.input),
    refresh,
    "Évaluation enregistrée",
  );
  const setStatus = useTeacherMutation(
    (v: { id: string; status: AssessmentStatus }) => assessmentsApi.setStatus(v.id, v.status),
    refresh,
    "Statut mis à jour",
  );
  const remove = useTeacherMutation(
    (id: string) => assessmentsApi.remove(id),
    refresh,
    "Évaluation supprimée",
  );
  return { create, update, setStatus, remove };
}

export function useQuestionMutations() {
  const refresh = [teacherKeys.questionsAll];
  const create = useTeacherMutation(
    (v: { assessmentId: string; input: CreateQuestionInput }) =>
      questionsApi.create(v.assessmentId, v.input),
    refresh,
    "Question ajoutée",
  );
  const update = useTeacherMutation(
    (v: { id: string; input: UpdateQuestionInput }) => questionsApi.update(v.id, v.input),
    refresh,
    "Question enregistrée",
  );
  const remove = useTeacherMutation(
    (id: string) => questionsApi.remove(id),
    refresh,
    "Question supprimée",
  );
  return { create, update, remove };
}
