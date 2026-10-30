import { ResourcesPage } from "@/features/resource/ResourcePages";
import { useCampusTargets } from "../hooks/useCampusTargets";

export function StudentResourcesPage() {
  const { classes, subjects } = useCampusTargets();
  return <ResourcesPage classes={classes} subjects={subjects} />;
}
