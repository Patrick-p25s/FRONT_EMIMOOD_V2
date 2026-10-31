import { ResourcesPage } from "@/features/resource/ResourcePages";
import { useCampusTargets } from "../hooks/useCampusTargets";
import { useAccount } from "@/features/profile/hooks/useProfile";

export function StudentResourcesPage() {
  const { classes, subjects } = useCampusTargets();
  const canUpload = useAccount().data?.is_delegate === true;
  return <ResourcesPage classes={classes} subjects={subjects} canUpload={canUpload} />;
}
