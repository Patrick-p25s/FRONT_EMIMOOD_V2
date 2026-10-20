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
