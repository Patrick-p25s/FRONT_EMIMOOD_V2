import { useStudentSubjects } from "./useStudentCourses";

export function useCampusTargets() {
  const data = useStudentSubjects(undefined).data;
  return {
    classes: data ? [{ id: data.classe_id, name: data.classe_name }] : [],
    subjects:
      data?.subjects.map((subject) => ({ id: subject.subject_id, name: subject.name })) ?? [],
  };
}
