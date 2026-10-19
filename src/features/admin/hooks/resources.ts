import { useAdminList } from "@/features/admin/hooks/useAdminList";
import type {
  AcademicYear,
  AdminUser,
  Classe,
  Subject,
  University,
} from "@/features/admin/api/types";

/** Listes de référence (page_size 20) pour les sélecteurs et la résolution des noms. */
export const useUniversities = () =>
  useAdminList<University>("universities", "/universities/", { page_size: 20 });

export const useYears = () =>
  useAdminList<AcademicYear>("academic-years", "/academic-years/", { page_size: 20 });

export const useClasses = (
  params: {
    university_id?: string;
    academic_year_id?: string;
    mention?: string;
    level?: string;
    statut?: string;
    q?: string;
    page?: number;
    page_size?: number;
  },
  enabled = true,
) => useAdminList<Classe>("classes", "/classes/", params, enabled && !!params.university_id);

export const useSubjectsAll = (u?: string) =>
  useAdminList<Subject>("subjects", "/subjects/", { university_id: u, page_size: 20 }, !!u);

export const useTeachers = (u?: string) =>
  useAdminList<AdminUser>(
    "users",
    "/users/",
    { role: "teacher", statut: "active", university_id: u, page_size: 20 },
    !!u,
  );
