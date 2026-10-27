// features/enseignant/api/types.ts : tels que décrits dans votre document
export type ChapterText = { id: string; content: string };
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
  content?: ChapterText[] | undefined;
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

export type ChapterDocument = {
  id: string;
  chapter_id: string;
  created_by: string;
  title: string;
  description: string | null;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  url: string;
  position: number;
  created_at: string;
  updated_at: string;
};
export type AssessmentType = "quiz" | "exam" | "assignment";
export type AssessmentStatus = "draft" | "published" | "archived";
export type Assessment = {
  id: string;
  class_subject_id: string;
  created_by: string;
  title: string;
  description: string | null;
  assessment_type: AssessmentType;
  status: AssessmentStatus;
  start_at: string | null;
  end_at: string | null;
  duration_minutes: number | null;
  max_attempts: number;
  show_correction: boolean;
  created_at: string;
  updated_at: string;
  /** Calculée par le serveur : draft, upcoming, open, closed, archived. */
  phase: string;
};

export type QuestionType =
  "single_choice" | "multiple_choice" | "true_false" | "short_answer" | "open_answer";
export type Choice = { id: string; content: string; is_correct: boolean; position: number };
export type Question = {
  id: string;
  assessment_id: string;
  content: string;
  question_type: QuestionType;
  points: number;
  position: number;
  choices: Choice[];
};

/** Valeurs exactes non confirmées : on les traite comme du texte, avec un libellé de secours. */
export type AttemptStatus = string;

export type ChoiceReview = { id: string; content: string; is_correct: boolean; position: number };
export type AnswerDetail = {
  question_id: string;
  content: string;
  question_type: QuestionType;
  points: number;
  choices: ChoiceReview[];
  selected_choice_ids: string[];
  answer_text: string | null;
  points_awarded: number | null;
  feedback: string | null;
};
export type AttemptRow = {
  id: string;
  student_id: string;
  student_name: string;
  attempt_number: number;
  status: AttemptStatus;
  started_at: string;
  submitted_at: string | null;
  score: number | null;
};
export type AttemptReview = {
  attempt_id: string;
  assessment_id: string;
  attempt_number: number;
  status: AttemptStatus;
  submitted_at: string | null;
  score: number | null;
  max_score: number;
  details: AnswerDetail[] | null;
  student_id: string;
  student_name: string;
};
export type StudentResultRow = {
  student_id: string;
  student_name: string;
  attempts: number;
  best_score: number | null;
  pending: number;
};
export type AssessmentResults = {
  assessment_id: string;
  max_score: number;
  students_count: number;
  graded_count: number;
  pending_attempts: number;
  average: number | null;
  highest: number | null;
  lowest: number | null;
  students: StudentResultRow[];
};

// api/types.ts
export type PublicationType = "resource" | "experience" | "project" | "announcement" | "event";
export type PublicationVisibility = "class" | "university";
export type PublicationStatus = "published" | "hidden";
export type AuthorRole = "student" | "teacher" | "moderator" | "super_admin";

export type Page<T> = { items: T[]; total: number; page: number; page_size: number; pages: number };

export type AuthorBrief = { id: string; name: string; role: AuthorRole; avatar_url: string | null };
export type PublicationDocument = {
  id: string;
  kind: "file" | "link";
  url: string | null;
  download_path: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  subject_id: string | null;
};
export type Publication = {
  id: string;
  university_id: string;
  classe_id: string | null;
  publication_type: PublicationType;
  visibility: PublicationVisibility;
  status: PublicationStatus;
  title: string | null;
  content: string;
  event_at: string | null;
  event_location: string | null;
  created_at: string;
  updated_at: string;
  author: AuthorBrief;
  document: PublicationDocument | null;
  likes_count: number;
  saves_count: number;
  saved_by_me: boolean;
  signals_count: number;
  signaled_by_me: boolean;
  comments_count: number;
  liked_by_me: boolean;
  is_mine: boolean;
};
export type PublicationComment = {
  id: string;
  publication_id: string;
  parent_id: string | null;
  author: AuthorBrief;
  content: string;
  created_at: string;
  is_mine: boolean;
};
export type LikeResult = { liked: boolean; likes_count: number };
export type SaveResult = { saved: boolean; saves_count: number };
export type SignalResult = { signaled: boolean; signals_count: number };
