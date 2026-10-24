import { createFileRoute } from "@tanstack/react-router";
import { PublicProfilePage } from "@/features/profile/pages/PublicProfilePage";

export const Route = createFileRoute("/membres/$userId")({ component: MemberRoute });

function MemberRoute() {
  const { userId } = Route.useParams();
  return <PublicProfilePage userId={userId} />;
}
