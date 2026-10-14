export type Resource =
  | "universities"
  | "academic-years"
  | "mentions"
  | "levels"
  | "classes"
  | "users"
  | "invitation-codes"
  | "subjects"
  | "class-subjects"
  | "teacher-assignments";

export const adminKeys = {
  all: ["admin"] as const,
  resource: (r: Resource) => ["admin", r] as const,
  list: (r: Resource, params: object) => ["admin", r, "list", params] as const,
  detail: (r: Resource, id: string) => ["admin", r, "detail", id] as const,
};
