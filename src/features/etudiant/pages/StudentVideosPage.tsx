import { VideosPage } from "@/features/videos/VideosPage";
import { useCampusTargets } from "../hooks/useCampusTargets";

export function StudentVideosPage() {
  const { subjects } = useCampusTargets();
  return <VideosPage subjects={subjects} />;
}
