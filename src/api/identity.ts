import { api } from "./client";

export type Role = "student" | "teacher" | "moderator" | "super_admin";

export type User = {
  id: string;
  university_id: string | null;
  classe_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: Role;
  statut: "active" | "inactive" | "suspended";
  is_verified: boolean;
};

export type University = {
  id: string;
  name: string;
  code: string;
  description: string | null;
  logo_url: string | null;
};
export type AcademicClass = {
  id: string;
  level_id: string;
  academic_year_id: string;
  name: string;
  code: string;
  description: string | null;
};
export type Level = { id: string; mention_id: string; name: string; code: string };
export type Mention = {
  id: string;
  university_id: string;
  name: string;
  code: string;
  description: string | null;
};
export type AcademicYear = {
  id: string;
  university_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
};
export type UserContext = {
  university: University | null;
  classe: AcademicClass | null;
  level: Level | null;
  mention: Mention | null;
  academicYear: AcademicYear | null;
};
export type RegisterPayload = {
  first_name: string;
  last_name: string;
  phone_number?: string;
  email: string;
  password: string;
  invitation_code: string;
};
export type ProblemReport = { subject: string; message: string };

export const identityApi = {
  register: (payload: RegisterPayload) =>
    api.post<{ accessToken: string; refreshToken: string }>("/auth/register", payload, {
      authenticated: false,
    }),
  login: (email: string, password: string) =>
    api.post<{ accessToken: string; refreshToken: string }>(
      "/auth/login",
      { email, password },
      { authenticated: false },
    ),
  logout: (refreshToken: string | null) =>
    api.post<void>("/auth/logout", { refreshToken }, { authenticated: false }),
  me: () => api.get<User>("/users/me"),
  updateMe: (
    data: Pick<User, "first_name" | "last_name" | "phone_number" | "avatar_url" | "bio">,
  ) => api.patch<User>("/users/me", data),
  reportProblem: (data: ProblemReport) => api.post("/reports/", data),
  context: async (user: User): Promise<UserContext> => {
    const [university, classe] = await Promise.all([
      user.university_id
        ? api.get<University>(`/universities/${user.university_id}`)
        : Promise.resolve(null),
      user.classe_id ? api.get<AcademicClass>(`/classes/${user.classe_id}`) : Promise.resolve(null),
    ]);
    if (!classe)
      return { university, classe: null, level: null, mention: null, academicYear: null };

    const [level, academicYear] = await Promise.all([
      api.get<Level>(`/levels/${classe.level_id}`),
      api.get<AcademicYear>(`/academic-years/${classe.academic_year_id}`),
    ]);
    const mention = await api.get<Mention>(`/mentions/${level.mention_id}`);
    return { university, classe, level, mention, academicYear };
  },
};
