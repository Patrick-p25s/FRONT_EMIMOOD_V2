// src/routes/admin.universities.$universityId.tsx (nouveau)
import { createFileRoute } from "@tanstack/react-router";
import { UniversityDetailPage } from "@/features/admin/pages/university-detail";

export const Route = createFileRoute("/admin/universities/$universityId")({
  component: DetailRoute,
});

function DetailRoute() {
  const { universityId } = Route.useParams();
  return <UniversityDetailPage universityId={universityId} />;
}
