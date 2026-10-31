// features/profile/pages/ProfilePage.tsx
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ErrorState } from "@/components/emimood/molecules/states";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyProfile } from "../../hoooks/useProfile";
import { ProfileView } from "../ProfileView";
import { EditProfileDialog } from "../EditProfileDialog";

export function ProfilePage() {
  const profile = useMyProfile();
  const [editing, setEditing] = useState(false);

  if (profile.error) {
    return (
      <div className="page">
        <ErrorState error={profile.error} onRetry={() => void profile.refetch()} />
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
    <>
      <ProfileView
        profile={profile.data}
        actions={
          <>
            <Button variant="outline" onClick={() => setEditing(true)}>
              Modifier le profil
            </Button>
            <Button variant="outline" asChild>
              <Link to="/parametres">Paramètres</Link>
            </Button>
          </>
        }
      />
      <EditProfileDialog open={editing} onOpenChange={setEditing} />
    </>
  );
}
