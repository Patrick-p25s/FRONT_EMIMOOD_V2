// features/enseignant/api/types.ts : tels que décrits dans votre document
export type MyAssignment = {
  id: string;
  class_subject_id: string;
  classe_id: string;
  classe_name: string;
  semester: number | null;
  subject_id: string;
  subject_name: string;
};

export type TeacherSubject = {
  id: string;
  university_id: string;
  name: string;
  code: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type MySubject = { subject: TeacherSubject; is_owner: boolean; classes: MyAssignment[] };

export type ClassChoice = { id: string; name: string; code: string; academic_year_name: string };

export type CourseStatus = "draft" | "published" | "archived";
export type Course = {
  id: string;
  class_subject_id: string;
  created_by: string;
  title: string;
  description: string | null;
  status: CourseStatus;
  created_at: string;
  updated_at: string;
};
export type Chapter = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
};
export type ResourceType = "document" | "video" | "link" | "other";
export type CourseResource = {
  id: string;
  chapter_id: string;
  created_by: string;
  title: string;
  description: string | null;
  resource_type: ResourceType;
  url: string;
  position: number;
  created_at: string;
  updated_at: string;
};
