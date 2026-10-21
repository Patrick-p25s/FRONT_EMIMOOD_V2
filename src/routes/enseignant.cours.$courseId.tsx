import { createFileRoute } from "@tanstack/react-router";
import { CourseEditorPage } from "@/features/enseignant/pages/course-editor";

export const Route = createFileRoute("/enseignant/cours/$courseId")({ component: EditorRoute });

function EditorRoute() {
  const { courseId } = Route.useParams();
  return <CourseEditorPage courseId={courseId} />;
}
