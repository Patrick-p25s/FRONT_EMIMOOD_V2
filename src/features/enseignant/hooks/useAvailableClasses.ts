import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "../api/subjects";
import { teacherKeys } from "../keys";

export const useAvailableClasses = (enabled = true) =>
  useQuery({
    queryKey: teacherKeys.availableClasses(),
    queryFn: subjectsApi.availableClasses,
    enabled,
  });
