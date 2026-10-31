// hooks/useCourses.ts
import { useQuery } from "@tanstack/react-query";
import { chaptersApi, coursesApi } from "../api/courses";
import { teacherKeys } from "../keys";

export const useCourses = (classSubjectId: string) =>
  useQuery({
    queryKey: teacherKeys.coursesOf(classSubjectId),
    queryFn: () => coursesApi.list(classSubjectId),
  });

export const useCourse = (id: string) =>
  useQuery({ queryKey: teacherKeys.course(id), queryFn: () => coursesApi.get(id) });

export const useChapters = (courseId: string) =>
  useQuery({
    queryKey: teacherKeys.chapters(courseId),
    queryFn: () => chaptersApi.list(courseId),
    select: (list) => [...list].sort((a, b) => a.position - b.position),
  });
