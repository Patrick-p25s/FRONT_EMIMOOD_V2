// hooks/useGradeAttempt.ts
import { attemptsApi, type GradeItemInput } from "../api/attempts";
import { teacherKeys } from "../keys";
import { useTeacherMutation } from "./useTeacherMutation";

export const useGradeAttempt = () =>
  useTeacherMutation(
    (v: { id: string; grades: GradeItemInput[] }) => attemptsApi.grade(v.id, v.grades),
    [teacherKeys.attemptsAll, teacherKeys.resultsAll],
    "Copie corrigée",
  );
