// features/enseignant/hooks/useMySubjects.ts
import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "../api/subjects";
import { teacherKeys } from "../keys";

export const useMySubjects = () =>
  useQuery({ queryKey: teacherKeys.mySubjects(), queryFn: subjectsApi.mine });
