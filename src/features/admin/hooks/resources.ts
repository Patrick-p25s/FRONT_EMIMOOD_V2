import { useAdminList } from "@/features/admin/hooks/useAdminList";
import type { AcademicYear, AdminUser, Classe, Level, Mention, Subject, University } from "@/features/admin/api/types";

/** Listes de référence (page_size 200) pour les sélecteurs et la résolution des noms. */
export const useUniversities = () => useAdminList<University>("universities", "/universities/", { page_size: 200 });
export const useYears = (u?: string) => useAdminList<AcademicYear>("academic-years", "/academic-years/", { university_id: u, page_size: 200 }, !!u);
export const useMentions = (u?: string) => useAdminList<Mention>("mentions", "/mentions/", { university_id: u }, !!u);
export const useLevels = (mentionId?: string) => useAdminList<Level>("levels", "/levels/", { mention_id: mentionId }, !!mentionId);
export const useClasses = (params: { university_id?: string; mention_id?: string; level_id?: string; academic_year_id?: string }, enabled = true) =>
  useAdminList<Classe>("classes", "/classes/", params, enabled && !!params.university_id);
export const useSubjectsAll = (u?: string) => useAdminList<Subject>("subjects", "/subjects/", { university_id: u, page_size: 200 }, !!u);
export const useTeachers = (u?: string) =>
  useAdminList<AdminUser>("users", "/users/", { role: "teacher", statut: "active", university_id: u, page_size: 200 }, !!u);
