import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { chapterContentApi, studentApi } from "../api/student";
import { studentKeys } from "../keys";
import { retryPolicy } from "../lib/messages";

export const useStudentSubjects = (semester: number | undefined) =>
  useQuery({
    queryKey: studentKeys.subjects(semester),
    queryFn: () => studentApi.mine(semester),
    placeholderData: keepPreviousData,
    retry: retryPolicy,
  });

export const useStudy = (classSubjectId: string) =>
  useQuery({
    queryKey: studentKeys.study(classSubjectId),
    queryFn: () => studentApi.study(classSubjectId),
    retry: retryPolicy,
  });

export const useChapterContent = (chapterId: string) =>
  useQuery({
    queryKey: studentKeys.chapterContent(chapterId),
    queryFn: () => chapterContentApi.get(chapterId),
    retry: retryPolicy,
  });
