import { PublicProfilePage } from "@/features/profile/componets/pages/PublicProfilePage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/membres/$userId")({ component: MemberRoute });

function MemberRoute() {
  const { userId } = Route.useParams();
  return <PublicProfilePage userId={userId} />;
}
