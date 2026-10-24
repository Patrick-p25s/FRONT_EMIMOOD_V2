// features/profile/pages/PublicProfilePage.tsx : le profil d'une autre personne
import { Link } from "@tanstack/react-router";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePublicProfile } from "../../hoooks/useProfile";
import { isNotFound } from "@/lib/api/message";
import { ProfileView } from "../ProfileView";
export function PublicProfilePage({ userId }: { userId: string }) {
  const profile = usePublicProfile(userId);

  if (profile.error) {
    return (
      <div className="page">
        {isNotFound(profile.error) ? (
          <EmptyState
            title="Profil introuvable"
            description="Ce profil n’existe pas ou n’est pas accessible."
          />
        ) : (
          <ErrorState error={profile.error} onRetry={() => void profile.refetch()} />
        )}
      </div>
    );
  }
  if (!profile.data) {
    return (
      <div className="page">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <ProfileView
      profile={profile.data}
      actions={
        profile.data.is_me ? (
          <Link to="/profil" className={cn(buttonVariants({ variant: "outline" }), "no-underline")}>
            Voir mon profil
          </Link>
        ) : undefined
      }
    />
  );
}
